class DomCreater {

  button() {
    let item = document.createElement('li');
    let button = document.createElement('button');
    button.className = 'btn btn-sm BtnGroup-item gb-button';
    button.innerText = 'Display bugspots';
    let image = document.createElement('img');
    image.className = 'gb-button-icon';
    image.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACLlBMVEUAAAAqstgqstgqstgrstgqstgqstgqstgqstgqstgqstgrstgqstgqstgqstgqstgqstgqstgqstgqstgsstkqstgqstgqstgqstgqstgsstkqstgqstgqstgpsdgqstgqstgqstgts9gqstgpstgqstgttNkpstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgpstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgosdgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstj///8rAbqCAAAAuHRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwdARpZ7UDEML8D59fT8oS4IP+bph0NJmvPXIQt18mhSPAOK7mIHKd/PKnjWxmY06b8RDL3AEov3aBzdnQQo1OAiW7/AOD7xuRZN9aEwDxY3vOgwMbTsz5KY2+KdHAEGkcvp4MpzABBibmFjb1YHTPTxOFv85S6O/c4SKub3agM4XXUACYZRLwMKAQsBWiMI7AAAAAFiS0dEuTq4FmAAAAAHdElNRQfiBwgXNCaQgicpAAAA6ElEQVQY02NgAANGbR0mBjhgZtHV0zcwNGKF8tmMTUzNzC0sraxt2MECHLZ29g6OTs4urm6cID6Xu4enF7e3j6+ff0AgD1CANyg4JDQsPCIyKjomlg8owB8Xn5CYtCM5JTUtPUMAKCCYmZWdk5uXX1BYVFwiBBQQFiktK6+orKquqa0TFQOZKl7f0NjU3NLa1t4hAbZWsrOru6e3r3+C1ERpiMtkJk2eMnXa9BkzZSF8OflZs+fMnTd/wUIFiICi0qLFS5YuW75ipbIKWEB11eo1a9et37Bxk5o61Hsam7dobt22XQvEBgCP3EJ9EpKLQwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNy0wOFQyMzo1MjozOC0wNDowMDdKhBkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDctMDhUMjM6NTI6MzgtMDQ6MDBGFzylAAAAAElFTkSuQmCC');
    button.insertBefore(item, button.firstChild);

    button.addEventListener('click', function (event) {
      let button = event.target;
      if (button.classList.contains('selected')) {
        button.classList.remove('selected');
        turnOff();
        removeScore();
      } else {
        button.classList.add('selected');
        turnOn();
      }
    });
  }
}