import * as base from '../shared/base.js'

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-163427368-1');

// Import the Facebook Javascript SDK
function updateStatusCallback(){
  if (response.status === 'connected') {
    // The user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire.
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
    console.log('facebook is connected: logged in and app is authenticated');
    console.log('iud: ' + uid);
    console.log('accessToken: ' + accessToken);
  } 
  else if (response.status === 'not_authorized') {
    // The user hasn't authorized your application.  They
    // must click the Login button, or you must call FB.login
    // in response to a user gesture, to launch a login dialog.
    console.log('facebook is connected: logged in and app is authenticated');
  } 
  else {
    // The user isn't logged in to Facebook. You can launch a
    // login dialog with a user gesture, but the user may have
    // to log in to Facebook before authorizing your application.
    console.log('facebook is connected: logged in and app is authenticated');
  }
}

$.ajaxSetup({ cache: true });
$.getScript('//connect.facebook.net/en_US/sdk.js', function(){
  FB.init({
    appId: '613634386154840',
    version: 'v2.7'
  });     
  // $('#loginbutton,#feedbutton').removeAttr('disabled');
  // FB.getLoginStatus(updateStatusCallback);
});

$('#facebookShareBtn').on('click', function() {
  if (base.host.includes('localhost')) {
    var fbShareLink = 'http://www.catlinker.com';
  }
  else {
    var fbShareLink = window.location.href;
  }
  
  FB.ui({
    display: 'popup',
    method: 'share',
    href: fbShareLink,
  }, function(response){});
});

// Import the Twitter Javascript API
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));