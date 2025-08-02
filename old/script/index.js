function validateform(){
  var fname = document.getElementById('fname');
  var lname = document.getElementById('lname');
  var ph = document.getElementById('phNumber');

  if (fname == null || fname == "") {
    alert("Name cant be blank");
    return false;
  }
  if (lname == null || lname == "") {
    alert("Name cant be blank");
    return false;
  }
  if (phNumber.length != 10) {
    alert("check your phone number length");
    return false;
  }

}
