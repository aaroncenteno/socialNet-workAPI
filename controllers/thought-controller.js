const { Thought } = require('../models/Thought');
const User = require('../models/User');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'user',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    },

    // Get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'user',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // Create a thought
    createThought({ params, body }, res) {
        Thought.create(body)
        .then(({ _id}) => {
            return User.findOneAndUpdate(
                {_id: params.userId },
                {$push: { thoughts: _id } },
                { new: true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this username!'})
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Update thought
    updateThought({ params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.id },
            body,
            { new: true, runValidators: true }
        )
        .then(updatedThought => {
            if(!updatedThought) {
                return res.status(404).json({ message: 'No thought with this ID!' });
            }
            res.json(updatedThought);
        })
        .catch(err => res.json(err));
    },

    // Delete thought
    deleteThought({ params, body}, res ) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // add a reaction
    addReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thought with this ID has been found!' });
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err));
    },

    //delete Reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController