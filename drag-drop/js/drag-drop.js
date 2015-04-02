var dd_node = {

    id : null,
    type : null,
    class : null,
    showIcon : true,

    dragable : null,

    handle : null,
    handleIcon : null,

    icon : null,
    iconImage : null,

    label : null,
    labelText : null,

    minimize : null,
    minimizeIconON : null,
    minimizeIconOFF : null,

    removeOption: null,
    removeOptionIcon: null,
    children : null

};

var dd_panel = {

  id : null,       //id of the panel ('id')
  anchor : null,   //the anchor the attach the panel to ('#id')
  sortable : null, //is this list sortable (true/false)
  class : null,    //panel class ('class')
  header : null,   //the panel header ('Panle Title')

  //item priority inside elements (lowest first, highest last left to right)
  //default is (icon, label, handle, operator, remove)
  elementStructure : {
    image : { priority : 1, ratio : 1},
    label : { priority : 2, ratio : 6},
    handle : { priority : 3, ratio : 1},
    operation : { priority : 4, ratio : 1},
    remove : { priority : 5, ratio : 1}
  },

  //node list containing all the element data (see dd_node)
  nodes : {},

  //initialization function to draw the initial panel and set properties
  init : function(){

    //call the draw function to draw elements
    this.draw(this.nodes, null);

    //get the id of the anchor div element (panel container)
    var panelContainer = document.getElementById($(this.anchor).attr('id'));

    //initialize the panel container with *sortable
    var sortable = new Sortable(panelContainer, {
      sort : this.sortable.sort,
      draggable : this.sortable.draggable,
      filter : this.sortable.filter,
      group : this.sortable.group,
    });

  },

  /*
  * recursive function to draw all elements contained inside a dd_node
  * the new elements are appended to the panel container designated by the
  * anchor property
  *  node : dd_node - in the format { node_id : dd_node, ... }
  * parent : the id of the parent element
  */
  draw : function(node, parent){
    //iterate though all dd_nodes (top level)
    for(var i = 0; i < Object.keys(node).length; i++){

      var key = Object.keys(node)[i];    //get the key
      //build the element (see buildElement) and append to panel container
      $(this.anchor).append(this.buildElement(node[key], parent));
      //if the dd_nod has children make a recursive call to draw them
      if(node[key].children != null){ this.draw(node[key].children, node[key].id); }

    }

  },

  //draws and returns the dd_node jqeury element <div>
  //element : dd_node
  //parent : parent id
  buildElement : function(element, parent){

    /* Default layout
    *  To change order make changes to the dd_panel.elementStructure object
    * |     |               |      |         |      |
    * |IMAGE|     LABEL     |HANDLE|OPERATION|REMOVE|
    * |     |               |      |         |      |
    */

    //create the main div element for the item
    var div = $('<div/>',{
      id : element.id,
      class : element.class + " dd-element",
      parent : parent
    });
    //set the parent attribute
    div.attr('parent',parent);




    //build the label
    var labelDiv = $('<div/>',{
      class : 'dd-element-label-container'
    });

    var labelP = $('<p/>',{
      text : element.label,
      class : 'dd-element-label-p'
    });

    labelDiv.append(labelP);


    if(element.icon){
      var iconDiv = $('<div/>',{
        class : 'dd-element-img-container'
      });

      var icon = $('<img/>', {
        src : element.iconImage,
        class : 'dd-element-icon'
      });

      iconDiv.append(icon);
      div.append(iconDiv);

    }

    div.append(labelDiv);

    if(element.minimize){
      var minimizeDiv = $('<div/>',{
        class : 'dd-element-minimize-container',
        onclick :"dd_panel.minimizeClick(this, '" + this.anchor + "')"
      });

      var minimize = $('<img/>', {
        src : element.minimizeIconON,
        class : 'dd-element-minimize',
      });
      minimize.attr('secondary',element.minimizeIconOFF);


      minimizeDiv.append(minimize);
      div.append(minimizeDiv);
      div.attr('state',1);
    }

    return div;
    //return "<p id=" + element.id + ">" + element.label + "</p>";
  },

  minimizeClick : function(element, anchor){

    //change image states
    var secondary = $(element).find('img').attr('secondary');
    $(element).find('img').attr('secondary', $(element).find('img')[0].src);

    //update the image
    $(element).find('img')[0].src = secondary;

    //change the state attribute
    $(element).parent().attr('state',Math.abs($(element).parent().attr('state') - 1));

    //update the visibility of panel elements
    this.updateVisibility(anchor);

  },


  updateVisibility : function(container){

    //grab the parent object before entering the loop and loosing this access
    var controller = this;

    //loop through once and make sure all elements with a 1 state are visible
    $( container ).children('div').each(function( index ) {

      if($(this).attr('state')==1){
        controller.showElement(this); //see function showElement
      }

    });

    //do another pass and make sure all elements with state 0 have hidden children
    $( container ).children('div').each(function( index ) {

      if($(this).attr('state')==0){
          controller.hideElement(this); //see function hideElement
      }

    });

  },

  //function called to show an element's children
  //this cuntion is STATIC
  //element : the root element to process
  showElement : function(element){

    //grab the parent object before entering the loop and loosing this access
    var controller = this;

    //loop through all the elements in the parent div (should be entire list)
    //select only elements with the attribute parent = this element's id
    //this is intended to make sure all children that should be visible are made visible
    $(element).parent().children("[parent='" + $(element).attr('id') + "']").each(function( index ) {
      if($(this).parent().attr('state')!=0){
        controller.hideElement(this); //make recurvice call to children
        $( this ).show();             //hide current element
      }
    });

  },


  //function called to hide an element's children
  //this cuntion is STATIC
  //element : the root element to process
  hideElement : function(element){

    //grab the parent object before entering the loop and loosing this access
    var controller = this;

    //loop through all the elements in the parent div (should be entire list)
    //select only elements with the attribute parent = this element's id
    //this is intended to make sure all children are also hidden
    $(element).parent().children("[parent='" + $(element).attr('id') + "']").each(function( index ) {
      controller.hideElement(this);  //make recursive call to hide children
      $( this ).hide();              //hide the current element
    });

  },


  update : function(){}

};
