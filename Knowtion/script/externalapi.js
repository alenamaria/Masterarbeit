var baseURL='http://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc';
var serchLit='q=';
var katLit='category=';
var formatLit='format=5';
var startIndexLit='start-index=';
var maxResLit='max-results=50';
var and='&';

function constructYTBaseVideoSearchUrl(searchkey,katsearch,startindex){
	var url=baseURL;
	url=and+searchLit+searchkey;
	if(katsearch!="")
	{
			
	}
	
}



(function() {
  /**
   * An object that identifies the parameter values that the user has entered
   *     in the form that are different from the default values for their
   *     respective parameters.
   * @type {Object}
   */
  var currentValues = {};

  /**
   * An object that identifies the default values for the parameters shown
   *     in the form. The default values are used to determine which parameters
   *     the user has changed for the API request.
   * @type {Object}
   */
  var defaultValues = {};

  /**
   * An object that identifies the types of feeds that support a parameter.
   *     For example, YouTube video search feeds support the 'location'
   *     parameter, but other feed types (playlist search, standard feeds, etc.)
   *     do not support it. When the user changes the type of search request
   *     that is being executed -- e.g. from video search to playlist search --
   *     the showParamValue object determines which parameters will display in
   *     the search form for the newly selected feed type. The object is
   *     populated by a parameter sent in calls to the 'writeParamOption'
   *     function.
   * @type {Object}
   */
  var showParamValue = {};

  /**
   * An object that indicates whether each parameter is a URL parameter or a
   *     query parameter, where URL parameters are part of the base URL, and
   *     query parameters are used in key=value pairs. In the sample URL below,
   *     'VIDEO_ID' is a url parameter and 'key' is a query parameter:
   *     http://gdata.youtube.com/api/feeds/VIDEO_ID/comments?key=value
   * @type {Object}
   */
  var paramTypes = {};

  /**
   * The API request URL that contains all of the parameter values that the
   *     user has entered into the search form for the selected feed type.
   * @type {string}
   */
  var currentFeedUrl = '';

  /**
   * The type of API feed that the user is attempting to retrieve. The possible
   *     values for this variable will differ from API to API. The value set
   *     here is a default one for the YouTube API.
   * @type {string}
   */
  var queryType = 'videos';

  /**
   * An enumeration that lists APIs that the code supports.
   * @enum {string}
   */
  var services = {
    PICASAWEB: 'picasaweb',
    YOUTUBE: 'youtube'
  };

  /**
   * An string that identifies the currently selected service.
   * @type {string}
   */
  var service = '';

  /**
   * An object that identifies API request parameters that are supported for
   *     all types of Google Data API feeds.
   * @type {string}
   */
  var universalParams = {
    'google-jsonc-field-max-results': '1',
    'google-jsonc-field-start-index': '1'
  };

  /**
   * A boolean value that indicates whether an error message is currently
   *     displayed on the page.
   * @type {boolean}
   */
  var errorMsgShown = false;

  /**
   * An enumeration of strings used in the application to simplify future
   *     i18n efforts.
   * @type {Object}
   */
  var messages = {
    ERROR_MSG_NO_PARAMETERS: 'You need to enter enough search parameters ' +
        'to generate a feed URL.',
    ERROR_MSG_UNSUPPORTED_SERVICE: 'You have selected an unsupported ' +
        'service. Your computer will now self-destruct. Just kidding.' +
        'Please use a supported service.',
    CUSTOM_FEED_URL_HEADER: 'URL:',
    LOADING_RESULTS: 'Loading ...'
  };

  /**
   * This function identifies the Google Data API being used.
   * @param {string} serviceName The name of the API being used.
   */
  function setService(serviceName) {
    if (services[serviceName]) {
      service = services[serviceName];
    } else {
      alert(messages.ERROR_MSG_UNSUPPORTED_SERVICE);
    }
  }

  /**
   * This callback function processes the API response.
   * @param {object} json The API's JSON-C response.
   */
  function showItems(json) {
    // If there's already a request on the page, remove it.
    var apiRequestNode = document.getElementById('google-jsonc-request');
    if (apiRequestNode) {
      apiRequestNode.parentNode.removeChild(apiRequestNode);
    }   
  }

  /**
   * This function is called when the user submits the search form.
   * It builds the feed URL and creates a new script element in the DOM
   * whose source is the JSON-C feed and specifies the callback function.
   * @param {string} opt_feedUrl The URL for the feed you want to retrieve.
   *     This parameter is used in a demo that displays next/previous page
   *     links, in which the feed URL is calculated based on the link that
   *     the user clicks. Otherwise, the function parses the feed URL from
   *     the contents of the 'custom-feed-url' element.
   */
  function displayResults(opt_feedUrl) {
    // Show a "Loading..." indicator.
    var resultsNode = document.getElementById('google-jsonc-search-results');
    if (resultsNode) {
      var loadingMessageNode = document.createElement('p');
      loadingMessageNode.id = 'loading-videos-message';
      loadingMessageNode.appendChild(
          document.createTextNode(messages.LOADING_RESULTS));
      resultsNode.appendChild(loadingMessageNode);
    }

    // Disable the OK button if there is one.
    var okButton = document.getElementById('ok_button');
    if (okButton) {
      okButton.disabled = true;
    }

    // Retrieve the JSON feed.

    if (!opt_feedUrl) {
      // Parse URL from the contents of the 'custom-feed-url' page element.
      var urlContent = document.getElementById('custom-feed-url').innerHTML;
      urlContent = urlContent.replace(/<\/?pre>/g, '');
      urlContent = urlContent.replace(/\&amp;/g, '&');
      var feedUrlArray = urlContent.match(/http([^\<]+)/);

      // Following error case exists when there's no URL. This seems to only
      // happen if the user clicks the search button immediately without
      // entering any search parameters.
      if (!feedUrlArray) {
        if (okButton) {
          okButton.disabled = false;
        }

        // Show an error message.
        var errorMessage = document.getElementById('custom-feed-url-error-msg');
        if (errorMessage) {
          errorMessage.innerHTML = messages.ERROR_MSG_NO_PARAMETERS;
          errorMsgShown = true;
        }

        return;
      }
      opt_feedUrl = feedUrlArray[0];
    }
    currentFeedUrl = opt_feedUrl;

    // Create a script tag in the DOM that executes the API request.
    var apiRequestNode = document.createElement('script');
    apiRequestNode.src = opt_feedUrl +
        '&prettyprint=true&callback=goog_jsonc_showItems';
    apiRequestNode.id = 'google-jsonc-request';
    apiRequestNode.type = 'text/javascript';
    document.documentElement.firstChild.appendChild(apiRequestNode);
  }

  /**
   * This function builds the URL for a YouTube API request. Other APIs will
   * need custom functions to ensure that their URLs are built correctly.
   * The structure of the custom function is fairly straightforward:
   *
   * <ul>
   *   <li>Define a base URL</li>
   *   <li>Identify variables that are appended to the base URL before
   *       key=value pairs are added.
   *   <li>Return the base URL</li>
   * </ul>
   *
   * The 'constructUrl' function will then complete the URL by adding
   *     key=value pairs.
   *
   * @return {string} The base URL for the API request. This URL does not
   *     include key=value pairs, which are added by the constructUrl function.
   */
  function constructYTBaseUrl(queryType,username) {
    var baseUrl = 'http://gdata.youtube.com/feeds/api/';

    var region;
    var standardFeed;
    if (queryType == 'standardfeeds' &&
        document.getElementById('formonly-url-param-feed').value) {
      standardFeed = document.getElementById('formonly-url-param-feed').value;
    }
    if (queryType == 'standardfeeds' &&
        document.getElementById('formonly-url-param-region')) {
      region = document.getElementById('formonly-url-param-region').value;
    }
    if (queryType == 'playlistId' &&
        document.getElementById('formonly-url-param-playlistId')) {
      baseUrl += 'playlists/' +
          document.getElementById('formonly-url-param-playlistId').value;
    } else if (queryType != 'playlistId') {
      baseUrl += queryType;
    }

    // Only add region to URL if standardFeed is specified.
    if (standardFeed && region) {
      baseUrl += '/' + region + '/' + standardFeed;
    // add standardFeed to URL anytime it's specified.
    } else if (standardFeed) {
      baseUrl += '/' + standardFeed;
    } else if (queryType == 'playlists') {
      baseUrl += '/snippets';
    } else if (queryType == 'users') {
      var username =
          document.getElementById('formonly-url-param-username').value;
      if (username) {
        baseUrl += '/' + username;
      }
      var feedType =
          document.getElementById('formonly-url-param-feed-type').value;
      if (feedType) {
        baseUrl += '/' + feedType;
      }
    }
    return baseUrl;
  }

  /**
   * This function builds the feed URL for the API request.
   */
  function constructUrl() {
    // To enable this to work with different APIs, we will use an if clause
    // to identify the service being used.
    var baseUrl = constructYTBaseUrl();
    baseUrl += '?v=2&alt=jsonc';

    // Add any query parameters that the user has set to the feed URL.
    for (var param in currentValues) {
      if (currentValues[param] && paramTypes[param] == 'query' &&
          (showParamValue[param][queryType] ||
          showParamValue[param]['universal'])) {

        /*
         * param.toLowerCase() handles the following use case. The
         * YouTube API supports a different set of 'orderby' parameter values
         * depending on whether the user is requesting a video feed or a
         * playlist feed. In the search form, we define these as different
         * parameters, 'orderby' and 'orderBy', where one appears in the video
         * search form and the other appears in the playlist contents form. By
         * executing param.toLowerCase(), we ensure that the parameter
         * value is included correctly in the URL.
         */
        baseUrl += '&' + param.toLowerCase() + '=' +
            escape(currentValues[param]);

        if (service == 'youtube' && param == 'location') {
          // Adding "!" after the location parameter value in the YouTube API
          // restricts results to videos with geo coordinates. This statement
          // is in here so that we can show a demo of video results plotted on
          // a map and be sure that results will be associated with locations.
          baseUrl += '!';
        }
      }
    }
    if (document.getElementById('custom-feed-url')) {
      var customFeedUrlHtml = '<pre><strong>' +
          messages.CUSTOM_FEED_URL_HEADER +
          '</strong><br/>' + baseUrl + '</pre>';
      document.getElementById('custom-feed-url').innerHTML = customFeedUrlHtml;
    }
  }

  /**
   * This function compares an input parameter value with the default
   * parameter value to determine whether the user changed the value.
   * @param {string} param The name of the parameter.
   * @param {string} value The value of the parameter.
   * @return {boolean} Return true -- i.e. the user changed the value -- if
   *     (a) the user entered a value but the parameter has no default value,
   *     or (b) the parameter has a default value and the user entered a
   *     different value. Otherwise, return false.
   */
  function userChangedValue(param, value) {
    if (defaultValues[param]) {
      if (value == defaultValues[param]) {
        // The entered value is the same as the default value. No change.
        return false;
      } else {
        // There is a default value, but the user entered a different value.
        return true;
      }
    } else if (value) {
      // The user entered a value, but there is no default value.
      return true;
    }
    // There aren't any other cases indicative of a change.
    return false;
  }

  /**
   * This function specifies information about a parameter and adds the
   * parameter to the search form.
   * @param {string} param The name of the parameter being included.
   * @param {string} formText Text to display in the search form.
   * @param {object} feedTypes Types of feeds that use the parameter.
   * @param {string} opt_checked Flag determines whether param is included by
   *     default.
   * @param {string} opt_paramType "query" (default) or "url" parameter.
   * @param {string} opt_defaultValue The default parameter value.
   * @param {string} opt_size The size of the select box.
   * @param {string|array} opt_range The possible range of values for the param.
   */
  function writeParamOption(param, formText, feedTypes, opt_checked,
      opt_paramType, opt_defaultValue, opt_size, opt_range) {
    var checked = opt_checked ? 'checked' : '';
    var paramType = opt_paramType || 'query';
    paramTypes[param] = paramType;
    var defaultValue = opt_defaultValue || '';
    defaultValues[param] = defaultValue;
    var size = opt_size || '25';
    var range = opt_range || '';

    // Identify different types of feeds that use the parameter --
    // e.g. video/playlist feeds for YT, or album/user feeds for Picasa.
    if (feedTypes) {
      showParamValue[param] = {};
      if (service == 'youtube' && param == 'address') {
        showParamValue['location'] = {};
        paramTypes['location'] = 'query';
      }
      for (var feedType in feedTypes) {
        showParamValue[param][feedType] = 1;
        if (service == 'youtube' && param == 'address') {
          showParamValue['location'][feedType] = 1;
        }
      }
    }

    /* The following chunk of code writes a row in the search form.
     * Each row has a three elements:
     * <ul>
     *   <li>A checkbox is used in the working demo that lets developers
     *       customize their own search forms. The checkbox indicates that the
     *       developers wants to "hardcode" a value in the search form -- e.g.
     *       always specify the same location regardless of the user's search
     *       term. For tools that just show feed formats, without generating
     *       cut-and-paste code for a search form, checkboxes are hidden using
     *       the hideCheckboxes() function.</li>
     *   <li>The parameter name displays and links to its definition.</li>
     *   <li>An input field or select menu displays in which the user enters
     *       (or selects) a value for the parameter. The row highlights when
     *       the user changes the parameter value to something other than the
     *       default value and therefore includes onKeyUp and onChange
     *       functions for the input and select elements.</li>
     * </ul>
     *
     * Here's a sample row (with table tags for nice printing in JSDOC)
     * <table id="google-jsonc-parameter-table"> <!-- contains all params -->
     *   <tr id="google-jsonc-field-feed">
     *     <td id="include-field0-feed" class="unhighlight">
     *       <input type="checkbox" id="hc-query-param-feed"/>
     *     </td>
     *     <td id="include-field1-feed" class="unhighlight">
     *       &nbsp;<a href="reference.html#feedsp">feed</a>
     *     </td>
     *     <td id="include-field2-feed" class="unhighlight">
     *       <select id="formonly-query-param-feed"
     *           onchange="goog_jsonc_processFieldChange(this); return false"
     *           onkeyup="goog_jsonc_processFieldChange(this); return false">
     *         <option value="">&nbsp;---</option>
     *         <option value="top_rated">&nbsp;Top rated</option>
     *       </select><br/>
     *     </td>
     *   </tr>
     * </table>
     */

    // Make sure the parameter table exists.
    var searchFormParameterTable =
        document.getElementById('google-jsonc-parameter-table');
    if (!searchFormParameterTable) {
      return;
    }

    /*
     * paramNameForIds creates a value like 'query-param-max-results' or
     *     'url-param-username'.
     * paramNameForLink identifies the parameter definition to link to.
     */
    var paramNameForIds = paramType + '-param-' + param;
    var paramNameForLink = param; // Allows link to parameter definition.

    // Link to the 'location' parameter definition if the service is YouTube
    // and the parameter name is address.
    if (service == 'youtube' && param == 'address') {
      paramNameForLink = 'location';
    }

    // Define standard behavior for onchange and onkeyup events.
    var onChange = 'goog_jsonc_processFieldChange(this);';
    var onKeyUp = 'goog_jsonc_processFieldChange(this);';

    // Create row that will contain the API parameter in the search form.
    var searchFormRow = document.createElement('tr');
    searchFormRow.id = 'google-jsonc-field-' + param;

    // Create cell that displays the checkbox (see above) for the parameter.
    var searchFormRowCheckboxCell = document.createElement('td');
    searchFormRowCheckboxCell.id = 'include-field0-' + param;
    searchFormRowCheckboxCell.className = 'unhighlight';
    searchFormRowCheckboxCell.style.textAlign = 'center';
    var searchFormRowCheckbox = document.createElement('input');
    searchFormRowCheckbox.type = 'checkbox';
    searchFormRowCheckbox.id = 'hc-' + paramNameForIds;
    searchFormRowCheckboxCell.appendChild(searchFormRowCheckbox);

    // Create cell that displays the parameter name and links to its definition.
    var searchFormRowLinkCell = document.createElement('td');
    searchFormRowLinkCell.id = 'include-field1-' + param;
    searchFormRowLinkCell.className = 'unhighlight';

    /*
     * In the code below, paramNameForLink.toLowerCase() handles the following
     * use case. The YouTube API supports a different set of 'orderby' parameter
     * values depending on whether the user is requesting a video feed or a
     * playlist feed. In the search form, we define these as different
     * parameters, 'orderby' and 'orderBy', where one appears in the video
     * search form and the other appears in the playlist contents form. By
     * executing paramNameForLink.toLowerCase(), we ensure that the parameter
     * value is displayed and linked to correctly.
     */
    searchFormRowLinkCell.innerHTML = '&nbsp;<a href="reference.html#' +
        paramNameForLink.toLowerCase() + 'sp">' +
        paramNameForLink.toLowerCase() + '</a>';

    // Create cell that contains input or select element for API parameter.
    var searchFormRowFieldCell = document.createElement('td');
    searchFormRowFieldCell.id = 'include-field2-' + param;
    searchFormRowFieldCell.className = 'unhighlight';

    if (typeof range == 'object') {
      var parameterSelect = document.createElement('select');
      parameterSelect.id = 'formonly-' + paramNameForIds;
      parameterSelect.setAttribute('onchange', onChange);
      parameterSelect.setAttribute('onkeyup', onKeyUp);
      for (var rangeValue in range) {
        if (range[rangeValue]) {
          var parameterOption = document.createElement('option');
          parameterOption.value = rangeValue;
          parameterOption.innerHTML = '&nbsp;' + range[rangeValue];
          parameterSelect.appendChild(parameterOption);
        }
      }
      searchFormRowFieldCell.appendChild(parameterSelect);
    } else {
      var parameterInput = document.createElement('input');
      parameterInput.type = 'text';
      parameterInput.id = 'formonly-' + paramNameForIds;
      parameterInput.setAttribute('onchange', onChange);
      parameterInput.setAttribute('onkeyup', onKeyUp);
      parameterInput.size = size;
      parameterInput.value = defaultValue;
      var rangeText = document.createTextNode(' ' + range);
      searchFormRowFieldCell.appendChild(parameterInput);
      searchFormRowFieldCell.appendChild(rangeText);
    }

    searchFormRow.appendChild(searchFormRowCheckboxCell);
    searchFormRow.appendChild(searchFormRowLinkCell);
    searchFormRow.appendChild(searchFormRowFieldCell);
    searchFormParameterTable.appendChild(searchFormRow);
  }

  /**
   * This function hides checkboxes next to parameter names in the search form.
   * The search form can be inserted on multiple pages and, when used with the
   * checkboxes, can be used to generate customized search forms that users can
   * add to their own web pages. In those cases, the checkboxes let the
   * developer indicate that he'd like to hardcode parameter values (with
   * hidden input parameters) in his search form. At any rate, if the demo
   * doesn't generate custom search forms, the checkboxes are irrelevant.
   * Hence, the need for this function.
   */
  function hideCheckboxes() {
    var searchFormElement = document.getElementById('google-jsonc-search-form');
    var searchFormRows = searchFormElement.getElementsByTagName('tr');
    for (var i = 0, row; row = searchFormRows[i]; i++) {
      var rowId = row.id;
      if (rowId) {
        var rowParam = rowId.replace(/google-jsonc-field-/, '');
        if (rowId != rowParam) {
          rowCheckbox = document.getElementById('include-field0-' + rowParam);
          if (rowCheckbox) {
            rowCheckbox.style.display = 'none';
          }
        }
      }
    }
  }

  /**
   * This function changes the search form to display the appropriate API
   * request parameters for a particular type of API query. For example, the
   * YouTube API search form lets users retrieve user feeds (favorite videos or
   * uploads), video search results, standard feeds, playlist search results,
   * or playlist contents. An API request for video search results would use
   * different API request parameters than a request for playlist contents.
   *
   * This function checks the showParamValue object for each parameter to
   * determine whether the parameter is shown for the new query type. The
   * showParamValue object's contents are set in the writeParamOption function.
   * That function's feedTypes parameter identifies the types of feeds for
   * which a given parameter is used. For example, the 'q' parameter is used
   * for video search feeds and playlist search feeds, but not for user feeds
   * or playlist contents.
   * @param {string} field The field that has been changed.
   * @param {boolean} skipFieldChange Optional Skip field change.
   */
  function processQueryTypeChange(queryTypeField, skipFieldChange) {
    var customForm = document.getElementById('show-search-form');
    var customRows = customForm.getElementsByTagName('tr');
    queryType = queryTypeField.value;
    var queryParameterElement =
        document.getElementById('formonly-query-param-q');
    if (!skipFieldChange) {
      processFieldChange(queryParameterElement);
    }
    for (var i = 0, row; row = customRows[i]; i++) {
      if (row.id) {
        var param = row.id.replace(/google-jsonc-field-/, '');
        if (showParamValue[param] &&
            (showParamValue[param][queryTypeField.value] ||
            showParamValue[param]['universal'])) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      }
    }
  }

  /**
   * This function handles changes to the form input so that it can properly
   * show other sections or modify checkboxes as needed.
   * @param {string} field The field that has been changed.
   */
  function processFieldChange(field) {
    var fieldId = field.id.replace(/formonly-/, '');
    var parameter = fieldId.replace(/query-param-/, '');
    parameter = parameter.replace(/url-param-/, '');

    /* This code handles a special use case in the YouTube API where the user
     * is prompted to enter the location associated with a video, but the API
     * is expecting input like "Boston, MA" rather than like latitude/longitude
     * coordinates. In this case, the API expects the user to enter "Boston" in
     * the location field, but we want the API request to say
     * 'location=42.3584308%2C-71.0597732' rather than 'location=Boston'.
     *
     * The YouTube search form defines an 'address' parameter rather than a
     * 'location' parameter so that the location query parameter can be
     * determined using the Maps API geocoder rather than by user input.
     */
    if (service == 'youtube' && parameter == 'address') {
      showAddress(field.value);
      var latLong = document.getElementById('query-param-location').value;
      if (latLong) {
        currentValues['location'] = latLong;
      } else {
        currentValues['location'] = '';
      }
    }

    // Highlight (or unhighlight) parameter name and input/select field
    // depending on whether the user has changed the parameter value.
    var td1 = 'include-field1-' + parameter;
    var td2 = 'include-field2-' + parameter;
    var paramLinkCell = document.getElementById(td1);
    var paramFieldCell = document.getElementById(td2);
    if (paramLinkCell && paramFieldCell) {
      if (field.value && userChangedValue(parameter, field.value)) {
        paramLinkCell.className = 'highlight';
        paramFieldCell.className = 'highlight';
        // The 'address' parameter is not included in YouTube API requests.
        if (service == 'youtube' && parameter != 'address') {
          currentValues[parameter] = field.value;
        }
      } else {
        paramLinkCell.className = 'unhighlight';
        paramFieldCell.className = 'unhighlight';
      }
    }

    // Remove error message once we have some type of user input.
    if (errorMsgShown) {
      var errorMessage = document.getElementById('custom-feed-url-error-msg');
      if (errorMessage) {
        errorMessage.innerHTML = '';
      }
      errorMsgShown = false;
    }

    constructUrl();
  }

  /**
   * This function converts the JSON-C feed into a printable format that shows
   * the elements and nesting relationships in the feed.
   * @param {string|object} jsonObject The object being formatted. This could
   *     be a single element or an object with children of its own. For
   *     example, under the root node, itemsPerPage is a string and items is
   *     an object.
   * @param {number} opt_indent The text to use to indent property names in
   *     the formatted JSON-C feed.
   * @return {string} Return formatted JSON-C feed.
   */
  function prettyPrintFeed(jsonObject, opt_indent) {
    var prettyFeed = '';
    var indent = opt_indent || '';

    for (var property in jsonObject) {
      var value = jsonObject[property];
      if (!value) {
        continue;
      }
      if (typeof value == 'object') {
        if (value instanceof Array) {
          if (typeof value[0] == 'string') {           
          } else {
            // Recurse for formatted array of objects, as with 'items' property.
            value = prettyPrintFeed(value, indent + '&nbsp;&nbsp;');
            prettyFeed += indent + "'" + property + "': " +
                '[<br>' + value + '<br>' + indent + '],<br>';
          }
        } else {
          // Recurse for non-array objects like 'thumbnail' property for video.
          value = prettyPrintFeed(value, indent + '&nbsp;&nbsp;');
          prettyFeed += indent + "'" + property + "': " + '{<br>' +
              value + '<br>' + indent + '}' + ',<br>';
        }
      } else {       
        if (typeof value == 'string') {
          value = "'" + value + "'";
        }
        prettyFeed += indent + "'" + property + "': " + value + ',<br>';
      }
    }

    // Remove comma from appearing after '}' if there is no succeeding element.
    prettyFeed = prettyFeed.replace(/,<br>$/, '');
    // Remove '#': { if number isn't really a key but just an array index.
    prettyFeed = prettyFeed.replace(/'\d+': \{/g, '{');

    return prettyFeed;
  }
})();

