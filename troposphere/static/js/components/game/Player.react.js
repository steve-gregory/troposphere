define(function (require) {
  "use strict";

  var React = require('react'),
    Router = require('react-router'),
    $ = require('jquery'),
    RouteHandler = Router.RouteHandler;

return React.createClass({

         handleKeyDown: function(e) {
          var keyCode = e.keyCode;
          switch (keyCode) {
              case 37:
                  e.preventDefault();
                  if(this.state.xPos-20 >= 0) {
                      this.setState({xPos: this.state.xPos - 20});
                  }
                  break;
              case 39:
                  e.preventDefault();
                  if(this.state.xPos+120 <= $(window).width()) {
                      this.setState({xPos: this.state.xPos + 20});
                  }
                  break;
          }
          this.props.onMove(this.state.xPos);
         },

         componentDidMount: function(){
            $(document.body).on('keydown', this.handleKeyDown);
         },

         getInitialState: function(){
            return({
               xPos: 0,
               yPos: 400
            })
         },

         render: function(){
            var divStyle = {
               background: 'url("/assets/images/game/iplant_logo.png")',
               position: 'absolute',
                width: '105px',
                height: '105px',
                left: this.state.xPos,
                top: this.state.yPos
            };

            return(

                  <div style={divStyle} className="box" />

            );
         }
      });
});