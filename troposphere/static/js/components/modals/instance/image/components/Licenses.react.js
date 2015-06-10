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
            <span style={{"padding-left": "8px"}}>{license.get('title')}</span>
          </label>
        </li>
      )
    },

    onToggleEditMode: function(){
      this.setState({
        isEditing: !this.state.isEditing
      })
    },

    renderNewLicenseButton: function(){
      return (
        <a
          className="btn btn-primary new-tag"
          href="#"
          onClick={this.onToggleEditMode}
        >
          + Add License
        </a>
      )
    },

    renderCreateLicenseForm: function(){
      return (
        <div className="form">
          <div className="form-group">
            <label className="control-label">Title</label>
            <div>
              <input type="text" className="form-control" placeholder="Title..."/>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label">Type</label>
            <div>
              <select className="form-control">
                <option>text</option>
                <option>url</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label">Value</label>
            <div>
              <textarea className="form-control" rows="3"></textarea>
            </div>
          </div>
          <a className="btn btn-primary" onClick={this.onToggleEditMode}>+ Add License</a>
        </div>
      )
    },

    renderHorizontalCreateLicenseForm: function(){
      return (
        <div className="form-horizontal">
          <div className="form-group">
            <label className="control-label col-sm-3">Title</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" placeholder="Title..."/>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3">Type</label>
            <div className="col-sm-9">
              <select className="form-control">
                <option>text</option>
                <option>url</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3">Value</label>
            <div className="col-sm-9">
              <textarea className="form-control" rows="3"></textarea>
            </div>
          </div>
          <a className="btn btn-primary" onClick={this.onToggleEditMode}>+ Add License</a>
        </div>
      );
    },

    renderSplitCreateLicenseForm: function(){
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
              <button type="submit" class="btn btn-primary" onClick={this.onToggleEditMode} style={{float: "right"}}>Add License</button>
            </div>
          </div>
        </div>
      );
    },

    renderSplitCreateLicenseForm2: function(){
      return (
        <div>
          <div className="form-inline">
            <div className="form-group">
              <label className="control-label sr-only">Title</label>
              <div>
                <input type="text" className="form-control" placeholder="Title..."/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label sr-only">Type</label>
              <div>
                <select className="form-control">
                  <option>text</option>
                  <option>url</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-sm-3">Value</label>
              <div className="col-sm-9">
                <textarea className="form-control" rows="3"></textarea>
              </div>
            </div>
            <button type="submit" class="btn btn-default" onClick={this.onToggleEditMode}>Add License</button>
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
            {this.state.isEditing ? this.renderSplitCreateLicenseForm() : this.renderNewLicenseButton()}
          </div>
        </div>
      );
    }

  });

});
