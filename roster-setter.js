// BN  |  Andrew Bogut GS - C      Injured   |  Sac    10:30pm | 102   - | 39%|



// active = game today

// 0) Click Swap Mode radio button (for insurance).
// 0a) Bench all INACTIVE STARTERS.
// 1) Find first active bench player.
    //   A. If Injured SKIP PLAYER (ADD TO IMPLEMENTATION LATER!)
// 2) Do one of these:
    //   A. Put in Empty Matching Position Slot - iterate through multiples
    //   B. Put in Empty Utility Slot
    //   C. Replace player in Matching Position Slot ONLY IF startPlayer.status == empty
    //   D. Replace player in Utility Slot ONLY IF startPlayer.status == empty
    //   E. Replace player in Matching Position Slot ONLY IF benchPlayer.startPct > startPlayer.startPct
    //   F. Replace player in Utility Slot ONLY IF benchPlayer.startPct > startPlayer.startPct
// 3) Move on to next active bench player and repeat step 2 UNTIL all bench players looped through once.
// 4) Loop once more through active bench players comparing startPct to Utility starting players and replace as needed.
// 5) Click Save Changes.

//LOAD jQuery !!!
var s = document.createElement("script");
s.type = "text/javascript";
s.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(s)

setTimeout(doTheMagic, 2000); //gives jQuery time to load

function doTheMagic(){
  console.log("jQuery loaded!");

  var rosterDone = false;
  var startersDone, benchersDone;

  // add diff method for array subtraction:
  Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  };

  function buildBenchers(){
    var benchers = [].slice.call( $(".bench") );
    if ([].slice.call( $(".empty-bench") ) ) {
      benchers = benchers.diff([].slice.call( $(".empty-bench") ) );
    }
    // $(".empty-bench").remove();
    benchers.pop();
    return benchers;
  }

  function buildStarters(benchers){
    var starters = [].slice.call( document.getElementsByClassName("editable") ).diff(benchers);
    starters.pop(); // removes false final starter in DOM
    return starters;
  }

  //PROBLEM: IT'S ADDING TO ARRAY THE INDICES OF ALL PLAYERS, NOT JUST STARTERS
  function buildInactiveStarters(starters){
    var inactiveStarters = [];
    for (var i = 0; i < starters.length; i++) {
      if (starters[i].className.indexOf("empty") === -1 && starters[i].children[4].childNodes[0].children.length === 0) {inactiveStarters.push(i)}
    }
    return inactiveStarters;
  }

  function benchInactiveStarters(starters, inactiveStarters){
    if (inactiveStarters.length > 0){
      for (var i = 0; i < inactiveStarters.length; i++) {
        $currStarter = $(starters[inactiveStarters[i]]);
        // debugger;
        $currStarter.click(); // swap begun
        $(".empty-bench").click(); // swap complete
        // debugger;
      }
    }
    return true;
  }

  function buildActiveBenchers(benchers){
    // debugger;
    var activeBenchers = [];
    for (var i = 0; i < benchers.length; i++) {
      // debugger;
      if (benchers[i].children[4].childNodes[0].children.length !== 0) {activeBenchers.push(i)}
    }
    return activeBenchers;
  }

  function startActiveBenchers(activeBenchers){
    if (activeBenchers.length > 0) {
      for (var i = 0; i < activeBenchers.length; i++){ // will iterate through all active benchers
        $currBencher = $(benchers[activeBenchers[i]]);
        $currBencher.click();
        // alert("On " + $currBencher.find("a")[2].text); // for testing
        $swappables = $(".swaptarget");
        for (var j = 0; j < $swappables.length; j++){
           if ($swappables[j].className.indexOf("empty") > -1){$swappables[j].click()}
        }
      }
      return false;
    } else {return true}
  }

  $("#dnd").click() //ensures swap mode
  var loops = 0;
  
  while (rosterDone === false) {
    loops++;

    var benchers = buildBenchers();
    var starters = buildStarters(benchers);

    if (benchers.length === 0) { break };

    var inactiveStarters = buildInactiveStarters(starters);
    benchersDone = benchInactiveStarters(starters, inactiveStarters);
    // debugger;

    benchers = buildBenchers();

    var activeBenchers = buildActiveBenchers(benchers);
    startersDone = startActiveBenchers(activeBenchers);

    activeBenchers = [];
    inactiveStarters = [];

    benchers = [];
    starters = [];

    rosterDone = startersDone && benchersDone;
    if (loops > 29) { break }; // fail-safe
  }
  if ($("#top-rostersave-msg").text() !== "All changes saved") {$(".roster-save-btn").click()}
}

// TODO: bench injured players
// TODO: if both utility spots are full and there is an empty spot anywhere else then look to see if utility player can be moved there and if so reiterate
// PROBLEM: STILL NOT BENCHING ALL INACTIVE STARTERS ON ONE SHOT...

// // looking for injury
// for (var i = 0; i < rubioChildren.length; i++){
//    if (rubioChildren[i].className == "F-injury") {"Rubio hurt"}
// }
