define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      onCreateLicense: React.PropTypes.func.isRequired,
      onCancel: React.PropTypes.func.isRequired
    },

    getInitialState: function(){
      return {
        title: "",
        type: "",
        value: ""
      }
    },

    onTitleChange: function(e){
      this.setState({
        title: e.target.value
      });
    },

    onTypeChange: function(e){
      this.setState({
        type: e.target.value
      });
    },

    onValueChange: function(e){
      this.setState({
        value: e.target.value
      });
    },

    onCreateLicense: function(){
      this.props.onCreateLicense({
        title: this.state.title.trim(),
        type: this.state.title.trim(),
        value: this.state.title.trim()
      })
    },

    render: function(){
      return (
        <div className="clearfix">
          <div className="form-inline clearfix">
            <div className="form-group col-sm-6">
              <label className="control-label">Title</label>
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title..."
                  style={{width: "100%"}}
                  onChange={this.onTitleChange}
                />
              </div>
            </div>
            <div className="form-group col-sm-6">
              <label className="control-label">Type</label>
              <div>
                <select className="form-control" style={{width: "100%"}} onChange={this.onTypeChange}>
                  <option>text</option>
                  <option>url</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form col-sm-12">
            <div className="form-group">
              <label className="control-label">Value</label>
              <div>
                <textarea className="form-control" rows="3" onChange={this.onValueChange}/>
              </div>
            </div>
            <button onClick={this.onCreateLicense} style={{float: "right", marginLeft: "8px"}}>Add License</button>
            <button onClick={this.props.onCancel} style={{float: "right", marginLeft: "8px"}}>Cancel</button>
          </div>
        </div>
      );
    }

  });

});
