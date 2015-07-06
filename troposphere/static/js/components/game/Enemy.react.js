define(function (require) {
  "use strict";

  var React = require('react'),
    Router = require('react-router'),
    $ = require('jquery'),
    RouteHandler = Router.RouteHandler;

return React.createClass({
         componentDidMount: function(){
            setInterval(function(){this.moveDown()}.bind(this), 500);
         },

         reset: function(){
           this.setState(this.getInitialState());
         },

         moveDown: function(){
            if(this.state.yPos > 300 && !this.state.passed){
                if(this.state.shouldGivePoint) {
                    this.props.pass();
                }
                this.setState({
                   passed: true
                });
                this.reset();
            }

            else {
                this.setState({yPos: this.state.yPos + 100});
                this.checkForCollision();
            }
         },

         checkForCollision: function(){
          if(this.state.yPos >= 400) {
              if (this.state.xPos >= this.props.playerPos() && this.state.xPos < this.props.playerPos() + 100) {
                  console.log("collision!");
                  this.setState({
                      shouldGivePoint: false
                  });
                  this.props.onCollide();
              }
              else if (this.state.xPos + 100 > this.props.playerPos() && this.state.xPos + 100 < this.props.playerPos() + 100) {
                  console.log("collision!");
                  this.setState({
                      shouldGivePoint: false
                  });
                  this.props.onCollide();
              }
          }
         },

         getInitialState: function(){
            return({
               xPos: Math.random() * 1180,
               yPos: 0,
               passed: false,
               shouldGivePoint: true
            })
         },

         render: function(){
            var divStyle = {
               background: 'url("/assets/images/game/lightning.png")',
               height: '100px',
               width: '86px',
               position: 'absolute',
               left: this.state.xPos,
               top: this.state.yPos
            };

            if(!this.state.passed){
               return(
                 <div id={this.props.id} style={divStyle} className="enemy" />
               );
            }

            return <div />
         }
      });
});