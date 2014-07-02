/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'collections/ApplicationCollection',
    './ApplicationCardList.react',
    './SearchContainer.react',
    'stores/ApplicationStore'
  ],
  function (React, PageHeader, ApplicationCollection, ApplicationCardList, ApplicationSearch, ApplicationStore) {

    // Here is the simplest possible mixin to get a global scroll event
    var SimplePageScrollMixin = {
      componentDidMount: function () {
        window.addEventListener('scroll', this.onScroll, false);
      },
      componentWillUnmount: function () {
        window.removeEventListener('scroll', this.onScroll, false);
      }
    };

    // However, usually what we want is to detect when the user starts and
    // stops scrolling. Here's a way to do it.

    // If we don't get a scroll event within 200 ms, assume the user
    // stopped scrolling.
    var SCROLL_TIMEOUT = 200;

    // How often to check if we're scrolling; this is a reasonable default.
    var CHECK_INTERVAL = SCROLL_TIMEOUT / 2;

    var PageScrollStartEndMixin = {
      mixins: [SimplePageScrollMixin],
      componentDidMount: function () {
        this.checkInterval = setInterval(this.checkScroll, CHECK_INTERVAL);
        this.scrolling = false;
      },
      componentWillUnmount: function () {
        clearInterval(this.checkInterval);
      },
      checkScroll: function () {
        if (Date.now() - this.lastScrollTime > SCROLL_TIMEOUT && this.scrolling) {
          this.scrolling = false;
          this.onScrollEnd();
        }
      },
      onScroll: function () {
        if (!this.scrolling) {
          this.scrolling = true;
          this.onScrollStart();
        }
        this.lastScrollTime = Date.now();
      }
    };

    function getState() {
      return {
        applications: ApplicationStore.getAll(),
        scrolling: false
      };
    }

    return React.createClass({
      mixins: [PageScrollStartEndMixin],

      onScrollStart: function() {
        this.setState({scrolling: true});
      },

//      $(window).scroll(function() {
      // This seems to work...
//         if($(window).scrollTop() + $(window).height() == $(document).height()) {
//             alert("bottom!");
//         }
//      });

      onScrollEnd: function() {
        this.setState({scrolling: false});
        var node = this.getDOMNode();
        console.log("this.Scroll Height: " + node.scrollHeight);
        console.log("this.Offset Height: " + node.offsetHeight);
        console.log("this.Scroll Top: " + node.scrollTop);

        var body = $('body')[0];
        console.log("body.Scroll Height: " + body.scrollHeight);
        console.log("body.Offset Height: " + body.offsetHeight);
        console.log("body.Scroll Top: " + body.scrollTop);
      },

      getInitialState: function () {
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
      },

      helpText: function () {
        return (
          <p>Applications are cool. You are, too. Keep bein' cool, bro.</p>
        );
      },

      render: function () {
        var content;
        if (!this.state.applications) {
          content = (
            <div className="loading"></div>
          );
        } else {
          var featuredApplicationArray = this.state.applications.filter(function (app) {
            return app.get('featured');
          });
          var featuredApplications = new ApplicationCollection(featuredApplicationArray);

          // todo: Add ability for user to toggle display mode and then put this back in the code
          //  <div className='view-selector'>
          //    {'View:'}
          //    <a className='btn btn-default'>
          //      <span className='glyphicon glyphicon-th'>{''}</span>
          //    </a>
          //    <a className='btn btn-default'>
          //      <span className='glyphicon glyphicon-th-list'>{''}</span>
          //    </a>
          //  </div>

          content = [
            <ApplicationCardList key="featured" title="Featured Images" applications={featuredApplications}/>,
            <ApplicationCardList key="all" title="All Images" applications={this.state.applications}/>
          ];
        }

        return (
          <div>
            <PageHeader title='Images' helpText={this.helpText}/>
            {"Scrolling: " + this.state.scrolling}
            <ApplicationSearch/>
            {content}
          </div>
        );

      }

    });

  });
