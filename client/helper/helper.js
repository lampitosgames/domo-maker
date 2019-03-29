const handleError = (message) - > {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

const redirect = (res) => {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = res.redirect;
}