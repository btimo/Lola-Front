const SET_PAGE_TITLE = 'SET_PAGE_TITLE';

const setPageTitle = (title) => {
  document.title = title;

  return {
    type: SET_PAGE_TITLE,
      payload: title,
  }
};

export {
  SET_PAGE_TITLE,
  setPageTitle,
};
