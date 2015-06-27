$(document).ready(function() {

  // musicClips['shortTitle'] = {
  //   id:
  //   title:
  //   shortTitle:
  //   description:
  //   tags:
  //   timeLength:
  //   rating:
  //   price:
  //   isClip: true
  // };

  //callback utility funcs
  var each = function(list, func) {
    if(!(typeof list == 'object' || typeof list == 'string')) {
      alert(list + " must be an object, array or a string");
    }
    else if(Array.isArray(list) || typeof list == 'string') {
      for(var i = 0, listLen = list.length; i < listLen; i++) {
        func(list[i]);
      }
    }
    else {
      for(var prop in list) {
        func(list[prop]);
      }
    }
  };

  var map = function(list, func) {
    var newList = [];
    each(list, function(elem) {
      newList.push(func(elem));
    });
    return newList;
  };

  var filter = function(list, test) {
    var passed = [];
    each(list, function(elem) {
      if(test(elem)){
        passed.push(elem);
      }
    });
    return passed;
  };

  //---------------------------------------

  //utility functions
  var replace = function(string, toReplace, replaceWith) {
    return string.split(toReplace).join(replaceWith);
  };

  var getPropListOf = function(obj) {
    return Object.keys(obj);
  };

  var average = function(list) {
    sum = 0;
    return function() {
      each(list, function(elem) {
        if (typeof elem == 'number') {
          sum += elem;
        }
        else {
          alert("error: array must contain all numbers");
          return;
        }
      });
      return sum/list.length;
    }();
  };

  var getUpperCaseOf = function(item) {
    if(Array.isArray(item)) {
      return map(item, function(elem) {
        if(isNaN(elem)) {
          elem = elem.toUpperCase();
        }
        return elem;
      });
    }
    else if(isNaN(item)) {
      return item.toUpperCase();
    }
    else {return item;}
  };

  var search = function(toBeSearched, searchingFor) {
    var toSearch = getUpperCaseOf(toBeSearched);
    var searchFor = getUpperCaseOf(searchingFor);

    if(typeof toSearch === 'number') {
      return toSearch == Number(searchFor) ? true : false;
    }
    else if(Array.isArray(toSearch) || typeof toSearch === 'string') {

      if(isNaN(Number(searchFor))) {
        return toSearch.indexOf(searchFor) >= 0 ? true : false;
      }
      else {
        return toSearch.indexOf(Number(searchFor)) >= 0 ? true : false;
      }
    }
    else if(typeof toSearch === 'string') {
      return toSearch.indexOf(searchFor) >= 0 ? true : false;
    }
    else if(typeof toSearch === "boolean" || typeof toSearch === 'object') {
      return false;
    }
    else alert('Could not complete search for ' + searchFor);
  };

  //---------------------------------------

  //musicClips object preparation
  each(musicClips, function(clip) {
    if(clip.title){
      clip.isClip = true;
    }
  });

  musicClips.currentList = [];

  //---------------------------------------

  //add methods to musicClips obj

  //for adding unique ids to clips obj
  musicClips.numID = {
    currentID: 0,
    getNewID: function () {
      this.currentID++;
      return this.currentID;
    }
  };

  musicClips.getShortTitle = function(title) {
    var newTitle = title.split(' ').join('_')
    .split('\\"').join('').split('\'').join('');
    return newTitle;
  };

  musicClips.getNumOfClips = function(clipsArr) {
    var counter = 0;
    each(clipsArr, function(clip) {
      if(clip.isClip) {
        counter++;
      }
    });
    return counter;
  };

  //get an array of all the clips
  musicClips.getAllClips = function() {
    return filter(this, function(prop) {
      return prop.isClip === true ? true : false;
    });
  };

  //get array of a single property from all clips
  musicClips.collectClipProp = function(clipArr, propName) {
    return map(clipArr, function(clip) {
      if(!clip[propName] && clip.isClip) {
        console.log(propName + " does not exist in " + clip.shortTitle);
      }
      else if(clip.isClip) {
        return clip[propName];
      }
    });
  };

  musicClips.getClipProp = function(clipShortTitle, propName) {
    return this[clipShortTitle][propName];
  };

  musicClips.setClipProp = function(clipShortTitle, propName, newValue) {
    this[clipShortTitle][propName] = newValue;
  };

  musicClips.deleteClip = function(clipShortTitle) {
    delete this[clipShortTitle];
  };

  //sort .currentList by property and direction
  musicClips.sortClipsBy = function(property, sortOpposite) {
    if(['ID', 'timeLength', 'rating', 'price'].indexOf(property) >= 0) {
      return this.currentList.sort(function(a, b) {
        if(isNaN(a[property])){
          return Number.MAX_VALUE;
        }
        if(sortOpposite) {
          return a[property] - b[property];
        }
        else {return b[property] - a[property];}
      });
    }
    else if(['title', 'description', 'tags'].indexOf(property) >= 0) {
      return this.currentList.sort(function(a, b) {
        if(a[property].toString().toUpperCase() >
           b[property].toString().toUpperCase()) {
          return sortOpposite ? -1 : 1;
        }
        if(a[property].toString().toUpperCase() <
           b[property].toString().toUpperCase()) {
          return sortOpposite ? 1 : -1;
        }
        else {return 0;}
      });
    }
    else{
      alert("clips could not be sorted..");
    }
  };

  musicClips.searchClip = function(clip, searchFor, propArr) {
    var searchDetected = false;
    propArr = propArr ||
      ['title', 'description', 'tags', 'price', 'timeLength', 'rating'];

    each(propArr, function(eachProp) {
      if(search(clip[eachProp], searchFor)) {
        searchDetected = true;
      }
    });
    return searchDetected;
  };

  musicClips.filterClipsBy = function(searchTerm, propArr, clipsArr) {
    var filteredArr = [];
    clipsArr = clipsArr || this.getAllClips();
    propArr = propArr ||
      ['title', 'description', 'tags', 'price', 'timeLength', 'rating'];
    var searchClip = this.searchClip;

    filteredArr = filter(clipsArr, function(clip) {
      return searchClip(clip, searchTerm, propArr);
    });
    return filteredArr;
  };

  musicClips.updateList = function(clipArray) {
    this.currentList = clipArray || musicClips.getAllClips();
  };

  //clip constructor..
  var MusicClip = function
  (title, description, tags, price, timeLength, rating) {
    this.isClip = true;
    this.ID = musicClips.numID.getNewID();
    this.title = title || 'new clip #' + this.ID;
    this.shortTitle = musicClips.getShortTitle(title);
    this.description = description || '';
    this.tags = tags || [];
    this.price = price || 'not set';
    this.timeLength = timeLength || 'not set';
    this.rating = rating || 'not set';
  };

  //method that uses constructor to add to clips..
  musicClips.addClip = function
  (title, description, tags, price, timeLength, rating) {
    this[this.getShortTitle(title)] = new MusicClip
    (title, description, tags, price, timeLength, rating);
  };

  musicClips.editClip = function
  (edit, title, description, tags, price, timeLength, rating) {
    edit.title = title || edit.title;
    edit.shortTitle = this.getShortTitle(title) || shortTitle;
    edit.description = description || edit.description;
    edit.tags = tags || edit.tags;
    edit.price = price || edit.price;
    edit.timeLength = timeLength || edit.timeLength;
    edit.rating = rating || edit.rating;
  };

  musicClips.getClipByID = function(id) {
    var allClips = this.getAllClips();
    var returnClip = filter(allClips, function(clip) {
      return clip.ID === id ? true : false;
    })[0];
    if(returnClip) {
      return returnClip;
    }
    else {
      alert('could not return clip with ID: ' + id);
    }
  };

  musicClips.calcSuggPrice = function(clipObj) {
    var timeLen = clipObj.timeLength;
    var rating = clipObj.rating;
    var suggPrice;

    if(isNaN(timeLen)){
      suggPrice = 20;
      if(!isNaN(rating)) {
        var mod = (rating - 1)/10;
        suggPrice = suggPrice + (suggPrice * mod);
        return Math.round(suggPrice);
      }
      else {return suggPrice;}
    }
    else if(!isNaN(timeLen)) {
      suggPrice = timeLen/3;
      if(!isNaN(rating)) {
        var mod = (rating - 1)/10;
        suggPrice = suggPrice + (suggPrice * mod);
        return Math.round(suggPrice);
      }
      else {return Math.round(suggPrice);}
    }
  };

  //---------------------------------------

  // more musicClips obj preparation..
  // add IDs and price prop to clips
  each(musicClips, function(clip) {
    if(clip.isClip) {
      clip.ID = musicClips.numID.getNewID();
      clip.price = 'not set';
    }
  });

  //---------------------------------------

  //JQUERY FUNCTIONS AND HTML SETUP

  musicClips.clipHTML = '<tr class=\"clipHTML\">\
  <td class=\"attr ID\"></td>\
  <td class=\"attr title\"></td>\
  <td class=\"attr description\"></td>\
  <td class=\"attr tags\"></td>\
  <td class=\"attr timeLength\"></td>\
  <td class=\"attr rating\"></td>\
  <td class=\"attr price\"></td>\
  <td class=\"clipButtons\">\
  <table class=\"clipEditButtons\">\
  <tbody><tr>\
  <td><button class=\"goToEditButton\">edit</button></td>\
  <td><button class=\"deleteClip\">delete</button></td>\
  </tr></tbody></table></td></tr>';

  musicClips.clipRatingHTML = '<span>rating:&nbsp;&nbsp;</span>\
  <input type=\"radio\" name=\"rating\" value=\"1\">1&nbsp;&nbsp;\
  <input type=\"radio\" name=\"rating\" value=\"2\">2&nbsp;&nbsp;\
  <input type=\"radio\" name=\"rating\" value=\"3\">3&nbsp;&nbsp;\
  <input type=\"radio\" name=\"rating\" value=\"4\">4&nbsp;&nbsp;\
  <input type=\"radio\" name=\"rating\" value=\"5\">5&nbsp;&nbsp;';

  musicClips.clearTable = function() {
    $('.clipHTML').remove();
  };

  musicClips.makeClipsTable = function() {
    this.clearTable();
    //make table
    var numClips = this.getNumOfClips(this.currentList);
    for(i=0; i<(numClips); i++) {
      $(this.clipHTML).appendTo('.clipTable');
    }
    //set ids
    var counter = 0;
    $('.clipHTML').each(function() {
      $(this).addClass('clipNum' + counter);
      counter++;
    });
  };

  musicClips.putClipHTML = function(clipObj, domLoc) {
    var temp;
    var propArr = ['ID', 'title', 'description', 'tags', 'price', 'timeLength', 'rating'];
    each(propArr, function(prop) {
      if(prop == 'tags') {
        domLoc.find('.' + prop).html((clipObj[prop]).join(', '));
      }
      else {
        domLoc.find('.' + prop).html(clipObj[prop]);
      }
      if(prop == 'description' || prop == 'tags') {
        temp = domLoc.find('.' + prop).html();
        temp = temp.slice(0, 35);
        domLoc.find('.' + prop).html(temp + '...');
      }
    });
  };

  musicClips.putCurrentList = function() {
    var counter = 0;
    var putClip = this.putClipHTML;
    each(this.currentList, function(clip) {
      putClip(clip, $('.clipNum' + counter));
      counter++;
    });
  };

  musicClips.initializeTable = function() {
    $('.clipAttrHeader').removeClass('sortedUp sortedDown');
    this.updateList();
    this.makeClipsTable();
    this.putCurrentList();
  };

  musicClips.putSortBy = function(sortTerm, sortOpposite) {
    this.sortClipsBy(sortTerm, sortOpposite);
    this.putCurrentList();
  };

  //sort on table header click
  $('.clipAttrHeader').click(function() {
    $(this).toggleClass('sortNormal');
    $(this).siblings().removeClass('sortedUp sortedDown');
    var prop = $(this).data('clipattr');
    if($(this).hasClass('sortNormal')) {
      musicClips.putSortBy(prop, false);
      $(this).removeClass('sortedUp');
      $(this).addClass('sortedDown');
    }
    else{
      musicClips.putSortBy(prop, true);
      $(this).removeClass('sortedDown');
      $(this).addClass('sortedUp');
    }
  });

  //search function
  var commitSearch = function() {
    $('.clipAttrHeader').removeClass('sortedUp sortedDown');
    var searchTerm = $('.searchBox').val();
    var searchWithin = [$('.searchDropdown').val()];
    if(searchTerm === '') {
      musicClips.initializeTable();
    }
    else {
      if(searchWithin.toString() === 'All') {
        musicClips.currentList =
          musicClips.filterClipsBy(searchTerm);
      }
      else {
        musicClips.currentList =
          musicClips.filterClipsBy(searchTerm, searchWithin);
      }
      musicClips.makeClipsTable();
      musicClips.putCurrentList();
    }
  };

  //search on search click
  $('.searchButton').click(function() {
    commitSearch();
  });

  //search on enter keydown
  $('.searchBox').keydown(function(event) {
    if(event.which == 13) {
      event.preventDefault();
      commitSearch();
    }
  });

  //go to edit window function
  musicClips.goToEditWindow = function() {
    $('.clipTableWrapper').addClass('hide');
    $('.editingWrapper').removeClass('hide');
  };

  //go to clip table function
  musicClips.goToClipTable = function() {
    $('.clipTableWrapper').removeClass('hide');
    $('.editingWrapper').addClass('hide');
  };

  //for radio button glitch fix
  musicClips.putRatingHTML = function() {
    $('#editClipRating').html(this.clipRatingHTML);
  };

  //show edit window and clip info on edit clip button press
  $('.appWrapper').on('click', '.goToEditButton', function () {
    musicClips.goToEditWindow();
    $('#submitEditClipButton').removeClass('hide');
    $('#submitNewClipButton').addClass('hide');
    var clipID = $(this).closest('.clipHTML').find('.ID').text();
    var clipObj = musicClips.getClipByID(Number(clipID));
    var clipObjTags = clipObj.tags.join(', ');
    $('.editWindowHeader').data('clipID', clipObj.ID);
    $('.editWindowHeader').text('Edit Clip #' + clipObj.ID);
    $('#editClipTitle').val(clipObj.title);
    $('#editClipDesc').val(clipObj.description);
    $('#editClipTags').val(clipObjTags);
    $('#editClipTimeLength').val(clipObj.timeLength);
    $('#editClipPrice').val(clipObj.price);
    musicClips.putRatingHTML();
    (function() {
      $('input[value=' + clipObj.rating + ']').attr('checked', true);
    }());
  });

  //delete clip button press
  $('.appWrapper').on('click', '.deleteClip', function () {
    var clipID = $(this).closest('.clipHTML').find('.ID').text();
    var clipObj = musicClips.getClipByID(Number(clipID));
    var conf = confirm("Are you sure you would like to delete this clip?");
    if(conf) {
      clipObj.isClip = false;
      musicClips.initializeTable();
    }
  });

  //add clip button press
  $('.addNewClipButton').click(function() {
    musicClips.goToEditWindow();
    $('#submitEditClipButton').addClass('hide');
    $('#submitNewClipButton').removeClass('hide');
    $('.editWindowHeader').text('New Clip');
    $('#editClipTitle').val('');
    $('#editClipDesc').val('');
    $('#editClipTags').val('');
    $('#editClipTimeLength').val('not set');
    $('#editClipPrice').val('not set');
    musicClips.putRatingHTML();
  });

  //submit edit button press
  $('#submitEditClipButton').click(function() {
    var editedClipID = $('.editWindowHeader').data('clipID');
    var editedClip = musicClips.getClipByID(editedClipID);
    var editTitle = $('#editClipTitle').val();
    var editDesc = $('#editClipDesc').val();
    var editTags = $('#editClipTags').val();
    editTags = editTags.split(', ').join(',').split(',');
    var editTimeLength = $('#editClipTimeLength').val();
    editTimeLength = Number(editTimeLength);
    var editPrice = $('#editClipPrice').val();
    editPrice = Number(editPrice);
    var editRating = $('#editClipRating input:checked').val();

    musicClips.editClip(editedClip, editTitle, editDesc, editTags, editPrice, editTimeLength, editRating);

    musicClips.initializeTable();
    musicClips.goToClipTable();
  });

  //submit new button press
  $('#submitNewClipButton').click(function() {
    var editTitle = $('#editClipTitle').val();
    var editDesc = $('#editClipDesc').val();
    var editTags = $('#editClipTags').val();
    editTags = editTags.split(', ').join(',').split(',');
    var editTimeLength = $('#editClipTimeLength').val();
    editTimeLength = Number(editTimeLength);
    var editPrice = $('#editClipPrice').val();
    editPrice = Number(editPrice);
    var editRating = $('#editClipRating input:checked').val();

    musicClips.addClip(editTitle, editDesc, editTags, editPrice, editTimeLength, editRating);

    musicClips.initializeTable();
    musicClips.goToClipTable();
  });

  //cancel button press
  $('#cancelSubmitClipButton').click(function() {
    musicClips.goToClipTable();
  });

  //click price and length fields
  $('#editClipPrice').click(function() {
    this.select();
  });
  $('#editClipTimeLength').click(function() {
    this.select();
  });

  //suggest price clicked in edit window
  $('#suggPriceButton').click(function() {
    var clip = {
      timeLength: $('#editClipTimeLength').val() || 'not set',
      rating: $('#editClipRating input:checked').val() || 'not set'
    };
    var suggestedPrice = musicClips.calcSuggPrice(clip);
    $('#editClipPrice').val(suggestedPrice);
  });

  //'suggest price for all' button clicked in header
  $('.setSuggPriceAllButton').click(function() {
    var allClips = musicClips.getAllClips();
    var suggPrice;

    each(allClips, function(clip) {
      suggPrice = musicClips.calcSuggPrice(clip);
      //console.log(suggPrice);
      clip.price = suggPrice;
    });
    musicClips.initializeTable();
  });

  //put table on page load
  musicClips.initializeTable();

});

