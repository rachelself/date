(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.sign-in').click(showLogin);
    $('.cancel').click(hideLogin);
  }

  function showLogin(e){
    e.preventDefault();
    $('#sign-in').toggleClass('show-modal');
    $('.container__home').toggleClass('disabled');
  }

  function hideLogin(){
    $('#sign-in').removeClass('show-modal');
    $('.container__home').removeClass('disabled');
  }

})();
