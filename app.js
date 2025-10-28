let likeCount = 0;
document.querySelector('.like-btn').addEventListener('click', () => {
  likeCount++;
  document.getElementById('like-count').innerText = likeCount;
});

document.getElementById('qa-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = e.target.querySelector('textarea').value;
  if (!text.trim()) return;
  const div = document.createElement('div');
  div.classList.add('qa-item');
  div.textContent = text;
  document.getElementById('qa-list').appendChild(div);
  e.target.reset();
});
