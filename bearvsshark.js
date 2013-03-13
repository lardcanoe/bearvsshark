if (Meteor.isClient) {

  Duels = new Meteor.Collection("duels");

  function showAnim(obj, anim, max) {
    $('#' + obj).removeClass(anim).addClass(anim);
    var wait = Meteor.setTimeout( function(){
        $('#' + obj).removeClass(anim);
        if (max > 0)
          $('#' + obj + 'image')[0].src = obj + Math.floor((Math.random() * max) + 1) + '.jpg';
      }, 1300
    );
  }

  Meteor.startup(function () {
    Session.set("voted", false);
    //Session.set("votes", 0);
    Meteor.subscribe('duels');
  });

  Template.bearvsshark.rendered = function() {
    showAnim('bear', 'bounceInDown', 0);
    showAnim('shark', 'bounceInUp', 0);
  };

  Template.results.bear = function () {
    var stat = Duels.findOne({name: 'bear'});
    return stat ? stat.wins : 0;
  };

  Template.results.shark = function () {
    var stat = Duels.findOne({name: 'shark'});
    return stat ? stat.wins : 0;
  };

  Template.results.humans = function () {
    var bear = Duels.findOne({name: 'bear'});
    var shark = Duels.findOne({name: 'shark'});
    return 0 - (bear ? bear.wins : 0) - (shark ? shark.wins : 0);
    //return 0 - Duels.aggregate({$group: { wins: {$sum: "$wins" }}}).wins;
  };

  Template.results.voted = function () {
    return Session.get("voted");
  };

  function getMax(name) {
    return name == 'bear' ? 5 : 5;
  }

  function voteCast(winner, loser) {
    //if (!Session.get("voted")) {
      Duels.update({name: winner}, {$inc: {wins: 1}});
      Duels.update({name: loser}, {$inc: {losses: 1}});
      Session.set("voted", true);
      //Session.set("votes", Session.get("votes") + 1);
      showAnim(winner, 'bounce', getMax(winner));
      showAnim(loser, 'fadeOut', getMax(loser));
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
