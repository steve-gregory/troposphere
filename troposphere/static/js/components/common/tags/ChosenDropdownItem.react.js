define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  return React.createClass({
    display: "ChosenDropdownItem",

    propTypes: {
      tag: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onTagSelected: React.PropTypes.func.isRequired
    },

    getInitialState: function(){
      return {
        isMouseOver: false
      }
    },

    onMouseEnter: function(){
      this.setState({isMouseOver: true})
    },

    onMouseLeave: function(){
      this.setState({isMouseOver: false})
    },

    onTagSelected: function(){
      this.props.onTagSelected(this.props.tag);
    },

    render: function () {
      var tag = this.props.tag,
          cx = React.addons.classSet,
          classes = cx({
            'active-result': true,
            'highlighted': this.state.isMouseOver
          });

      return (
        <li className={classes}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onTagSelected}>
          {tag.get('name')}
        </li>
      );
    }

  });

});
