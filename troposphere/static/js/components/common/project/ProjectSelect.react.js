/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    './ProjectOption.react'
  ],
  function (React, Backbone, stores, ProjectOption) {

    return React.createClass({

      propTypes: {
        projectId: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func.isRequired,
        allowCreate: React.PropTypes.bool,
      },

    componentDidMount: function () {
      stores.ProjectStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ProjectStore.removeChangeListener(this.updateState);
    },
      renderCreateOption: function () {
        this.props.allowCreate = this.props.allowCreate || false;
        if(this.props.allowCreate) {
            return (
            <optgroup label="New Project">
              <option value="-1">{"Create new project..."}</option>
            </optgroup>);
        }
      },
      render: function () {
        var options = this.props.projects.map(function (project) {
          return (
            <ProjectOption key={project.id} project={project}/>
          );
        });
        var projects = stores.ProviderStore.getAll();

        if (!projects) return (<div className="loading"></div>);

        return (
        <div>
          <select value={this.props.projectId} className='form-control' id='project' onChange={this.props.onChange}>
            <optgroup label="Projects">
              {options}
            </optgroup>

          {this.renderCreateOption()}
          </select>
        </div>
        );
      }
    });

  });