if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("bear", 0);
    Session.set("shark", 0);
    Session.set("voted", false);
  });

  Template.bearvsshark.rendered = function() {
    //testAnim('#bear', 'bounceInDown');
    //testAnim('#shark', 'bounceInUp');
    //$('#bear').addClass('animated bounceInDown');
    //$('#shark').addClass('animated bounceInUp');
  };

  Template.results.bear = function () {
    return Session.get("bear");
  };

  Template.results.shark = function () {
    return Session.get("shark");
  };

  Template.results.humans = function () {
    return 0 - Session.get("bear") - Session.get("shark");
  };

  Template.results.voted = function () {
    return Session.get("voted");
  };

  function showAnim(obj, anim) {
    $(obj).removeClass(anim).addClass(anim);
    var wait = Meteor.setTimeout( function(){
      $(obj).removeClass(anim)}, 1300
    );
  }

  Template.bearvsshark.events({
    'click .bear' : function () {
      Session.set("bear", Session.get("bear") + 1);
      Session.set("voted", true);
      showAnim('#bear', 'bounce');
      console.log("Bear wins!");
    },
    'click .shark' : function () {
      Session.set("shark", Session.get("shark") + 1);
      Session.set("voted", true);
      showAnim('#shark', 'bounce');
      console.log("Shark wins!");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
