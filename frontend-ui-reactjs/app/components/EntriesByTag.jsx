var React = require('react');
var EntryItem = require('./EntryItem.jsx');
var Pager = require('react-pager');
var EntriesModel = require('../models.jsx').EntriesModel;
var Pageable = require('./Pageable.js');


var EntriesByTag = React.createClass({
    mixins: [Pageable],
    propTypes: {},
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            content: [],
            totalPages: 10,
            number: 0
        };
    },
    componentDidMount: function () {
        var params = this.context.router.getCurrentParams(),
            query = this.context.router.getCurrentQuery();
        EntriesModel.findByTagName(params.tagName, query.page, query.size)
            .then(function (x) {
                this.setState(x);
            }.bind(this));
    },
    handlePageChanged: function (newPage) {
        var params = this.context.router.getCurrentParams();
        this.changeLocation(newPage, this.state.size);

        EntriesModel.findByTagName(params.tagName, newPage, this.state.size)
            .then(function (x) {
                this.setState(x);
            }.bind(this));
        window.scroll(0, 0);
    },
    render: function () {
        var entries = this.state.content.map(function (entry) {
            return (
                <EntryItem key={entry.entryId} entry={entry}/>
            );
        });
        return (
            <div>
                <h2>Posts tagged with {this.context.router.getCurrentParams().tagName} ...</h2>
                {entries}
                <Pager total={this.state.totalPages}
                    current={this.state.number}
                    visiblePages={5}
                    onPageChanged={this.handlePageChanged} />
            </div>
        );
    }

});
module.exports = EntriesByTag;
