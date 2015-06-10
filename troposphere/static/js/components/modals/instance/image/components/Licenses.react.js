define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      actions = require('actions'),
      LicenseCreateForm = require('./LicenseCreateForm.react');

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
      });
    },

    onCreateLicense: function(license){
      actions.LicenseActions.create(license);
      this.setState({ isEditing: false });
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
          <LicenseCreateForm
            onCancel={this.onToggleEditMode}
            onCreateLicense={this.onCreateLicense}
          />
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
