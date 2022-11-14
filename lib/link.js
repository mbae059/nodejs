const link = {
  createContent: () => {
    return `<a href="/create">create</a>`;
  },
  updateContent: (title) => {
    return `<a href="/update?id=${title}">update</a>`;
  },
  deleteContent: (title) => {
    return `
      <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <input type="submit" value="delete">
      </form>
    `;
  },
};

module.exports = link;
