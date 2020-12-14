const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtById,
    createThought,
    addReaction,
    updateThought,
    deleteThought,
    removeReaction
} = require('../../controllers/thought-controller')

router
    .route('/')
    .get(getAllThoughts)

router
    .route('/:userId')
    .post(createThought);


router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)

router
    .route('/:userId/:thoughtId')
    .delete(deleteThought)

router
    .route('/:thoughtId/reactions')
    .post(addReaction)

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(removeReaction)

module.exports = router;