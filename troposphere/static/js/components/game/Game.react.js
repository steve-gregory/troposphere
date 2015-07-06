define(function (require) {
  "use strict";

  var React = require('react'),
    Router = require('react-router'),
    $ = require('jquery'),
    Player = require('./Player.react'),
    Enemy = require('./Enemy.react'),
    RouteHandler = Router.RouteHandler;

  return React.createClass({

    getInitialState: function () {
      return ({
        points: 0,
        enemies: {},
        playerXPos: 0,
        mistake: null
      });
    },

    componentDidMount: function () {
      this.generateNew();
      setInterval(
        function () {
          this.generateNew();
        }.bind(this)
        , 7500);
    },

    givePoint: function () {
      this.setState({
        points: this.state.points + 1
      });
    },

    getPlayerPos: function () {
      return this.state.playerXPos;
    },

    handleCollision: function () {
      this.setState({
        mistake: "whoops!",
        points: this.state.points - 5
      });
      setTimeout(function () {
        this.setState({
          mistake: null
        });
      }.bind(this), 3000);
    },

    generateNew: function () {
      var enemies = this.state.enemies;
      var enemyLength = Object.keys(enemies).length;
      if (enemyLength < 6) {
        enemies[enemyLength] = <Enemy id={enemyLength} pass={this.givePoint} generate={this.generateNew} playerPos={this.getPlayerPos} onCollide={this.handleCollision} />;
        this.setState({
          enemies: enemies
        });
      }
    },

    handlePlayerMovement: function (pos) {
      this.setState({
        playerXPos: pos
      });
    },

    render: function () {
      var gameWidth = $(window).width();
      var divStyle = {
        background: '#04A5B7',
        height: '500px',
        paddingBottom: '25px',
        width: gameWidth
      };
      return (
        <div style={divStyle} className="game">
          <h1>{this.state.points}</h1>
          <h2>{this.state.mistake}</h2>
          <Player onMove={this.handlePlayerMovement} />
               {this.state.enemies}
        </div>
      );
    }
  });
});