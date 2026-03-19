some notes ive made during the ferry regarding FragmentCardDetails vs FragmentCard

---

# FragmentCard:

## receive fragment meta data

## get session data (user id)

## define (local) state of fragment

> isSaved: is fragment saved by user?
> isLiked: is fragment liked by user?

> loadingSaved: are we still resolving ground-truth of isSaved?

> likeCount: current # of fragment likes
> viewCount: current # of fragment views

> loadingMetrics: are we still resolving the actual number of likes + views?

## Effect 1. Load Viewer Metrics

### available for both (un)authenticated viewers

> try getFragmentMetrics for like/view counts
> try checkLikeStatus if we have authenticated userId
> set loadingMetrics to mark start & end of async await calls

> note that we run a quick parameter check on fragmentId + include fragmentId in the dependency array as a baseline test.

> effect may run additionally if userId's initialization is comparatively delayed. Ensures that we get the liked status. This means that there may be 2 separate periods of false->true->false `loadingMetrics` states.

## Effect 2. Load Saved Status

> the saved status of the fragment is only applicable if the user is authenticated

> insert userId into dependency array.

> if no userId, then "cancel any loading" and set the saved state to false as a default/placeholder. exit the effect since theres nothing more to be done.

> otherwise, "begin loading", get save status via `checkSaveStatus`, then update our local state to which the components will re-render accordingly.

one point that needs to be clarified is that whether success or error in try/catch, does the `finally` block set the `loadingSaved` state to `false` either way?

---

from what ive gathered thus far, the effects of FragmentCard are perfectly fine and align with the logic used similarly in FragmentCardDetails.

But there is likely discrepancy in our handler functions. Lets check those next.

---

## handleToggleSave

> check that user is authenticated.

> try/catch `saveFragment` invoke then update isSaved status accordingly.

## handleToggleLike

> check that user is authenticated.

> store previous state of `isLiked` and total `likeCount`

> optimistically update the UI first, then try/catch `toggleLikeFragment` invocation.

> if all goes well, then we get updated meta data from our server action to update our local state.

it is possible, and maybe even likely, that by the time `toggleLikeFragment` returns, our local state was already up-to-date since the effect for loading viewer metrics updates the same state.

Actually, this is a recurring redundancy pattern in my server actions that i should probably optimize.

---

(1) server action pings remote state/data --> (2) updates local state --> (3) components/UI are tied to local state

---

same functions between both cards:

-load viewer metrics
-load saved status
-handleToggleSave
-handleToggleLike

but FragmentCardDetails has:

-Record a view effect
-handleShare
-handleComments

---

# FragmentCardDetails:

## Effect 1. Record a View

> most of the logic seems straightforward. Just unsure what the point of the ref is here...

> looks like some way to avoid duplicates via a boolean flag approach? but seems both unnecessary and confusing. Unnecessary because we handle duplicate logic on the server side... tbf handling it on client side would be faster, but im not sure how it exactly handles that.

## handleShare

INCOMPLETE

## handleComments

INCOMPLETE
