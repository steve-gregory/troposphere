define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      onLicenseAdded: React.PropTypes.func.isRequired,
      onLicenseRemoved: React.PropTypes.func.isRequired,
      imageLicenses: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    getInitialState: function(){
      return {
        isEditing: false
      }
    },

    renderLicense: function(license){
      return (
        <li>
          <label>
            <input type="checkbox"/>
            <span style={{paddingLeft: "8px"}}>{license.get('title')}</span>
          </label>
        </li>
      )
    },

    onToggleEditMode: function(e){
      e.preventDefault();
      this.setState({
        isEditing: !this.state.isEditing
      })
    },

    renderNewLicenseButton: function(){
      return (
        <a
          href="#"
          onClick={this.onToggleEditMode}
        >
          + Add License
        </a>
      )
    },

    renderCreateLicenseForm: function(){
      return (
        <div>
          <hr/>
          <div className="col-sm-12 help-block">
            Fill out the information below describing the license.
          </div>
          <div className="clearfix">
            <div className="form-inline clearfix">
              <div className="form-group col-sm-6">
                <label className="control-label">Title</label>
                <div>
                  <input type="text" className="form-control" placeholder="Title..."  style={{width: "100%"}}/>
                </div>
              </div>
              <div className="form-group col-sm-6">
                <label className="control-label">Type</label>
                <div>
                  <select className="form-control" style={{width: "100%"}}>
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
                  <textarea className="form-control" rows="3"></textarea>
                </div>
              </div>
              <button onClick={this.onToggleEditMode} style={{float: "right"}}>Add License</button>
            </div>
          </div>
        </div>
      );
    },

    render: function () {
      var imageLicenses = this.props.imageLicenses;

      return (
        <div>
          <label>Licenses</label>
          <div>
            <div className="help-block">
              Please include licenses that should be able to launch this image.
            </div>
            <ul style={{padding: "0px"}}>
              {imageLicenses.map(this.renderLicense)}
            </ul>
            {this.state.isEditing ? this.renderCreateLicenseForm() : this.renderNewLicenseButton()}
          </div>
        </div>
      );
    }

  });

});
