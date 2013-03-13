if (Meteor.isClient) {

  Duels = new Meteor.Collection("duels");

  function showAnim(obj, anim) {
    $(obj).removeClass(anim).addClass(anim);
    var wait = Meteor.setTimeout( function(){
      $(obj).removeClass(anim)}, 1300
    );
  }

  Meteor.startup(function () {
    Session.set("voted", false);
    Meteor.subscribe('duels');
  });

  Template.bearvsshark.rendered = function() {
    showAnim('#bear', 'bounceInDown');
    showAnim('#shark', 'bounceInUp');
  };

  Template.results.bear = function () {
    return Duels.findOne({name: 'bear'}).wins;
  };

  Template.results.shark = function () {
    return Duels.findOne({name: 'shark'}).wins;
  };

  Template.results.humans = function () {
    return 0 - Duels.findOne({name: 'bear'}).wins - Duels.findOne({name: 'shark'}).wins;
    //return 0 - Duels.aggregate({$group: { wins: {$sum: "$wins" }}}).wins;
  };

  Template.results.voted = function () {
    return Session.get("voted");
  };

  function voteCast(winner, loser) {
    //if (!Session.get("voted")) {
      Duels.update({name: winner}, {$inc: {wins: 1}});
      Duels.update({name: loser}, {$inc: {losses: 1}});
      Session.set("voted", true);
      showAnim('#' + winner, 'bounce');
      showAnim('#' + loser, 'fadeOut');
      console.log(winner + " wins!");
    //}
  }

  Template.bearvsshark.events({
    'click .bear' : function () {
      voteCast('bear', 'shark');
    },
    'click .shark' : function () {
      voteCast('shark', 'bear');
    }
  });
}

if (Meteor.isServer) {
  Duels = new Meteor.Collection("duels");

  Meteor.publish('duels', function () {
    return Duels.find();
  });  

  Meteor.startup(function () {
    if (Duels.find().count() === 0) {
      Duels.insert({name: 'bear', wins: 0, losses: 0});
      Duels.insert({name: 'shark', wins: 0, losses: 0});
    }
  });  
}
