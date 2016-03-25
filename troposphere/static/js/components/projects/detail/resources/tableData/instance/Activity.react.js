import React from 'react/addons';
import Backbone from 'backbone';

var Activity = React.createClass({
      displayName: "Activity",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance;

        var activity = instance.get('activity');

        if (!activity){
            activity = "N/A";
        }

        return (
          <span>{activity}</span>
        );
      }
});

export default Activity;
