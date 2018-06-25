/**
 * @author aha-oretama
 * @Date 2018/05/28.
 */
"use strict";

import _ from 'lodash';
import addBaseFuncToRepo from 'js-github/mixins/github-db';
import addWalkerToRepo from 'js-git/mixins/walkers';
import co from 'co'; // co is more popular than gen-run.
import Octokit from '@octokit/rest';

export default class BugSpots {
  constructor(owner, repoName, token) {
    this.owner = owner;
    this.repoName = repoName;
    this.repo = {};
    // Add functions to repo in this method.
    addBaseFuncToRepo(this.repo, `${owner}/${repoName}`, token);
    addWalkerToRepo(this.repo);
    // Set up Octokit.
    this.octokit = Octokit();
    this.octokit.authenticate({
      type: 'token',
      token: token
    })
  }

  // TODO: ローカルバージョンを作ったほうが元のbugspotsと同等の機能を持つ
  // デフォルトは正規表現にワード境界を使用。
  analyze(regex = /\b(fix(es|ed)?|close(s|d)?)\b/i, branch = 'master') {

    let fixes = [];

    const localRepo = this.repo, localOwner = this.owner, localRepoName = this.repoName,
      localOctokit = this.octokit; // For using parameters in generator function.

    return co(function* () {
      const commitHash = yield localRepo.readRef(`refs/heads/${branch}`);
      let logStream = yield localRepo.logWalk(commitHash);

      let commit;
      // TODO: logStream.read(), localOctokit.repos.getCommit()を使用する度にGitHub APIの制限数に引っかかる可能性がある。そのハンドリングを実装すべき
      while (commit = yield logStream.read(), commit !== undefined) {
        console.info(commit);
        // if (regex.test(commit.message)) {
        const detail = yield localOctokit.repos.getCommit({
          owner: localOwner,
          repo: localRepoName,
          sha: commit.hash
        });

        console.info(detail);

        fixes.push({
          message: commit.message.split('\n')[0],
          date: commit.committer.date.seconds,
          files: detail.data.files.map(file => file.filename)
        });
      }

      const currentTime = _.now();
      let hotspots = [];
      const oldest_fix_date = _.last(fixes).date;
      fixes.forEach(fix => {
        fix.files.forEach(file => {
          const t = 1 - ((currentTime - fix.date) / (currentTime - oldest_fix_date));
          let target = _.find(hotspots, {file: file});
          if(target) {
            target.score += 1 / (1 + Math.exp((-12 * t) + 12));
          }else {
            hotspots.push({file: file, score: 0});
          }
        })
      });

      const spots = _.reverse(_.sortBy(hotspots, ['score', 'file']));

      return yield Promise.resolve({
        fixes: fixes,
        spots: spots
      })
    });
  }
}