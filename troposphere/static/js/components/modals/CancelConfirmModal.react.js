/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/BootstrapModal.react',
    'actions/projects',
    'models/project'
  ],
  function (React, BootstrapModal, ProjectActions, Project) {

    return React.createClass({

      // remove the modal from the DOM once we're finished with it
      cleanup: function(){
        document.getElementById('modal').innerHTML = "";
      },

      confirm: function () {
        this.refs.modal.hide();
        this.props.onConfirm();
      },

      cancel: function(){
        this.refs.modal.hide();
      },

      render: function(){
        var buttons = [
          {type: 'danger', text: 'Cancel', handler: this.cancel},
          {type: 'primary', text: this.props.confirmButtonMessage, handler: this.confirm}
        ];

        return (
          <BootstrapModal
            ref="modal"
            show={true}
            header="Create Project"
            buttons={buttons}
            handleHidden={this.cleanup}
          >
            {this.props.body}
          </BootstrapModal>
        );
      }

    });

  });
