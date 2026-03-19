import CollapsibleSection from "@/components/view/CollapsibleSection";

const FeaturesPage = () => {
  return (
    <div className="px-12 py-8">
      <h1 className="text-center text-2xl font-bold mt-10 mb-4">
        Features & Developer Notes
      </h1>
      <p className="text-center text-sm">NO AI USED.</p>
      <p className="text-center text-sm">
        A mid-level document outlining all major features (use cases),
      </p>
      <p className="text-center text-sm">
        including instruction sets and development particulars.
      </p>
      <p className="text-center text-sm">
        BROUGHT TO YOU FOR YOUR CONVENIENCE.
      </p>

      {/* <CollapsibleSection headerText={"Test Section"}>
        <>
          <p className="mt-4 p-2">
            Infinitely browse through the fragment database via seemless
            inter-connected routes. This application's routes are explicitly
            designed to enable coherent content navigation. To be more specific,
            one can imagine that there are 2 fundamental routes (base cases)
            which enable pagination content browse. They correspond to the home
            page and dynamic fragment details page:
          </p>

          <ol className="list-decimal mt-4 pl-9">
            <li>"/" (fetch paginated content)</li>
            <li>
              "/fragment/[fragmentId]" (fragment details + fetch paginated
              content)
            </li>
          </ol>

          <p className="mt-4 p-2">
            The application route set can then be interpreted as a cyclical
            graph. Some route transitions are presented below which allow for
            infinite, paginated scrolling behaviour:
          </p>

          <ul className="list-disc mt-4 pl-6">
            <li>"/" {`->`} "/fragment/[fragmentId]"</li>
            <li>"/fragment/[fragmentId]" {`->`} "/fragment/[fragmentId]"</li>

            <li>"/crystal/[crystalId]" {`->`} "/fragment/[fragmentId]"</li>
            <li>"/library" {`->`} "/fragment/[fragmentId]"</li>
            <li>
              "/library" {`->`} "/library/[crystalId]" {`->`}{" "}
              "/fragment/[fragmentId]"
            </li>
            <li>etc.</li>
          </ul>

          <p className="mt-4 p-2">
            This application implements pagination, enabling browse at scale.
            i.e., each page, or chunk, loads 20 fragments at a time. By default,
            we deploy our simplest pagination algorithm which sorts by
            latest-created-fragment. For more information on the pagination
            algorithm and/or upcoming updates, visit the developer notes.
          </p>

          <p className="mt-2 p-2">
            For browsing crystals directly, head to the explore page to browse
            featured crystals. Featured crystals are system-recognized crystals.
            Observe that all routes or components in "/explore" eventually lead
            to paginated, infinite scroll.
          </p>
        </>
      </CollapsibleSection> */}

      {/* BROWSE FRAGMENTS & EXPLORE CRYSTALS */}
      <CollapsibleSection headerText={"1) Browse Fragments & Explore Crystals"}>
        <>
          <p className="mt-4 p-2">
            Infinitely browse through the fragment database via seemless
            inter-connected routes. This application's routes are explicitly
            designed to enable coherent content navigation. To be more specific,
            one can imagine that there are 2 fundamental routes (base cases)
            which enable pagination content browse. They correspond to the home
            page and dynamic fragment details page:
          </p>

          <ol className="list-decimal mt-4 pl-9">
            <li>"/" (fetch paginated content)</li>
            <li>
              "/fragment/[fragmentId]" (fragment details + fetch paginated
              content)
            </li>
          </ol>

          <p className="mt-4 p-2">
            The application route set can then be interpreted as a cyclical
            graph. Some route transitions are presented below which allow for
            infinite, paginated scrolling behaviour:
          </p>

          <ul className="list-disc mt-4 pl-6">
            <li>"/" {`->`} "/fragment/[fragmentId]"</li>
            <li>"/fragment/[fragmentId]" {`->`} "/fragment/[fragmentId]"</li>

            <li>"/crystal/[crystalId]" {`->`} "/fragment/[fragmentId]"</li>
            <li>"/library" {`->`} "/fragment/[fragmentId]"</li>
            <li>
              "/library" {`->`} "/library/[crystalId]" {`->`}{" "}
              "/fragment/[fragmentId]"
            </li>
            <li>etc.</li>
          </ul>

          <p className="mt-4 p-2">
            This application implements pagination, enabling browse at scale.
            i.e., each page, or chunk, loads 20 fragments at a time. By default,
            we deploy our simplest pagination algorithm which sorts by
            latest-created-fragment. For more information on the pagination
            algorithm and/or upcoming updates, visit the developer notes.
          </p>

          <p className="mt-2 p-2">
            For browsing crystals directly, head to the explore page to browse
            featured crystals. Featured crystals are system-recognized crystals.
            Observe that all routes or components in "/explore" eventually lead
            to paginated, infinite scroll.
          </p>
        </>
      </CollapsibleSection>

      {/* CREATE FRAGMENTS & CRYSTALS */}
      <CollapsibleSection headerText={"2) Create Fragments & Crystals"}>
        <>
          <p className="mt-4 p-2">
            Creating a fragment entails uploading a new image + metadata to the
            system. Creating a crystal entails creating a new album, or,
            collection of fragments. The creation process of creating a crystal
            is distinct and more complex than creating a fragment. Access to the
            relevant creation processeses are made convenient via the side
            navigation bar for desktop + tablet, or, footer (tab) navigation bar
            for mobile viewports. We now walk you through the respective
            creation processes.
          </p>

          {/* Create Fragment Instructions */}
          <p className="mt-4 p-2 font-semibold">
            FRAGMENT CREATION INSTRUCTIONS
          </p>

          <p className="mt-4 p-2">
            Before starting the fragment creation process, ensure that you have
            an image ready, downloaded on your local device for upload. For
            creating a fragment, there are 4 simple steps:
          </p>

          <ol className="list-decimal mt-4 pl-9">
            <li>
              Click the (+) icon in the Side Navigation Bar to open the Create
              Menu Dropdown
            </li>
            <ul className="list-disc pl-6">
              <li>Or in the Footer Navigation Bar for mobile viewport</li>
            </ul>

            <li>Select the "Create Fragment" option in the Menu Dropdown</li>
            <ul className="list-disc pl-6">
              <li>
                Selecting the option links you to the Fragment Creation Form
              </li>
            </ul>

            <li>Fill out the Fragment Creation Form</li>
            <ul className="list-disc pl-6">
              <li>
                Upload your prepared image now via the image selector component
              </li>
              <li>
                Spend adequate time to ensure your name, tags, and description
                faithfully reflect the content of the image
              </li>
            </ul>

            <li>Press the "Create Fragment" button</li>
            <ul className="list-disc pl-6">
              <li>
                Your image is now uploaded, viewable either in your library or
                by other users during browse
              </li>
            </ul>
          </ol>

          {/* Create Crystal Instructions */}
          <p className="mt-4 p-2 font-semibold">
            CRYSTAL CREATION INSTRUCTIONS
          </p>

          <p className="mt-4 p-2">
            Creating a Crystal involves more steps. It is still simple. To
            reiterate, a crystal is a collection of fragments. Therefore it may
            be helpful, but optional, to upload your desired fragment set
            viewable in your library before starting the crystal creation
            process. There are 6 simple steps to create and populate a crystal:
          </p>

          <ol className="list-decimal mt-4 pl-9">
            <li>
              Click the (+) icon in the Side Navigation Bar to open the Create
              Menu Dropdown
            </li>
            <ul className="list-disc pl-6">
              <li>Or in the Footer Navigation Bar for mobile viewport</li>
            </ul>

            <li>Select the "Create Crystal" option in the Menu Dropdown</li>
            <ul className="list-disc pl-6">
              <li>
                Selecting the option links you to the Crystal Creation Form
              </li>
            </ul>

            <li>Fill out the Crystal Creation Form</li>
            <ul className="list-disc pl-6">
              <li>
                Spend adequate time to give your crystal a fitting name +
                description
              </li>
              <li>
                Optionally select whether you want your crystal to be private or
                not. Private crystals will be hidden when other users visit your
                profile or collection of work.
              </li>
            </ul>

            <li>Press the "Create Crystal" Button when you're done</li>
            <ul className="list-disc pl-6">
              <li>
                Upon successful creation, you will be redirected to your empty
                crystal
              </li>
            </ul>

            <li>
              Optionally seed your empty crystal via the Fragments Quick Add
              Modal
            </li>
            <ul className="list-disc pl-6">
              <li>
                This modal is triggered automatically via the Crystal Creation
                initialization process
              </li>
              <li>
                Feel free to browse through the modal, select multiple
                fragments, and press "Done" to seed your crystal
              </li>
              <li>
                Otherwise, press "Skip" to populate your crystal later. This
                modal can always be reopened by clicking "Add Images" in your
                Crystal page
              </li>
            </ul>

            <li>Alternate ways to populate your crystal involve:</li>
            <ul className="list-disc pl-6">
              <li>
                Navigate to your Library {`>`} Saved Fragments {`>`} and Select
                the Add Crystal button on any desired fragment
              </li>
              <li>
                During browse, all fragments have a button in the top left of
                their Fragment Card to initiate the fragment-to-crystal addition
                process. The button is a Crystal Icon
              </li>
              <li>
                Likewise, all Fragment Details Components also supply an "Add
                Crystal" button in the bottom toolbar of the Fragment Details
                Card
              </li>
            </ul>
          </ol>
        </>
      </CollapsibleSection>

      {/* MANAGE YOUR COLLECTION */}
      <CollapsibleSection headerText={"3) Manage your Collection"}>
        <>
          <p className="mt-4 p-2">
            Manage your saved or created work primarily through your profile
            (library) dashboard. Your profile dashboard is split into 2 tabs:
            Created and Saved.
          </p>

          <p className="mt-4 p-2 font-semibold">FRAGMENT DELETION</p>

          <p className="mt-4 p-2">
            In your Created tab, we display a grid of Crystal Cards and a
            Masonry Gallery of Fragment Cards. The Fragment Cards displayed here
            are unique to this page insofar that they enable the deletion
            operation of a Fragment. Fragment deletion by its creator is
            available through this route only. To delete a Fragment, find the
            "Delete" button in the top left of the on-hover top toolbar.
          </p>

          <div className="italic px-8">
            <p className="mt-4 p-2">
              It should be noted that this variant of the Fragment Card
              displayed in "/library?tab=created" enables "Save", like all other
              variants of the Fragment Card. However, saving a Fragment that you
              created will not appear in the Saved tab (/library?tab=saved). We
              distinguish between created and saved fragments in the UI by
              creator ID and save status. This avoids redundant rendering by
              defining mutually exclusive sets. i.e., in a mathematical
              notation:
            </p>
            <ul className="list-disc mt-4 pl-6">
              <li>
                Let S = set of saved fragments to display and C = set of created
                fragments to display
              </li>
              <li>{`S = { All fragments s.t. you are not the creator AND status is saved }`}</li>
              <li>{`C = { All fragments s.t. you are the creator }`}</li>
            </ul>
          </div>

          <p className="mt-4 p-2">
            Fragment deletion is permanent. Once deletion of a fragment is
            confirmed by the user, the system cascades deletion across the
            database. This means that in addition to the deletion of the
            fragment and image meta data, all records of likes, views, comments,
            comment likes, comment threads, are removed from the database.
            Likewise, all records of crystals and/or users that reference the
            fragment are also pulled from the system.
          </p>

          <p className="mt-4 p-2 font-semibold">EDITING CRYSTALS</p>

          <p className="mt-4 p-2">
            We covered how to create and populate or seed a crystal in the
            previous section. The operation to remove a fragment from the
            crystal is made accessible from the profile (library dashboard).
            There are only 2 steps to removing a fragment from a crystal:
          </p>

          <ol className="list-decimal mt-4 pl-9">
            <li>From the library page, select your desired crystal card</li>
            <ul className="list-disc pl-6">
              <li>This navigates you to the route: "/library/[crystalId]"</li>
              <li>
                NOT to be confused with the distinct route:
                "/crystal/[crystalId]"
              </li>
            </ul>

            <li>
              Hover over any Fragment you wish to remove, and select the
              "Remove" button
            </li>
            <ul className="list-disc pl-6">
              <li>
                The "Remove" button is located in the top left of the hover
                toolbar
              </li>
              <li>
                Removal of a fragment from the crystal can only be achieved here
              </li>
            </ul>
          </ol>
        </>
      </CollapsibleSection>

      {/* SEARCH */}
      <CollapsibleSection headerText={"4) Search"}>
        <>
          <p className="mt-4 p-2">
            There are actually 2 implementations of search in this application.
            The header search bar + modal and the user search bar in the
            messages modal. Both search features have distinct purposes and are
            outlined below.
          </p>

          <p className="mt-4 p-2 font-semibold">HEADER SEARCH BAR + MODAL</p>

          <p className="mt-4 p-2">
            The search engine in the header is more complex than the specialized
            search bar in the messages modal. The header search bar is paired
            with a modal UI that displays selectable, realtime query
            autocompletes (predictions) as you enter your query. Actually, the
            query predictions are loaded every 250 milliseconds so as to avoid
            server process overload. It is important to note that the query
            predictions are a function of your realtime query input, and are
            fetched from stored records of past queries by you or other users.
            Therefore, the more you (or another user) enter queries, the larger
            the query prediction pool becomes.
          </p>

          <p className="mt-4 p-2">
            When the search query input is empty, the header search modal
            defaults to the initial state, which displays (selectable)
            personalized and recommended content. The personalized
            recommendations are based on your user activity, therefore, it is
            possible that no personalized content exists, and the default UI
            modal state is empty. For now, the default state recommends both
            "Recommended Crystals" and "Similar Users".
          </p>

          <p className="mt-4 p-2">RECOMMENDED CRYSTALS ALGORITHM</p>

          <p className="mt-4 p-2">
            How do the recommendation algorithms work? The backend function that
            processes Recommended Crystals take your user profile, and searches
            the database for your most recently{" "}
            <span className="italic">viewed</span> and{" "}
            <span className="italic">liked</span> fragments. Then, a reverse
            fragment membership search is executed to find which crystals, if
            any, they belong to. It is these crystals, and at most 10 of them,
            which are then fetched for the recommendations. The point of the
            algorithm is to account for recent browsing activity.
          </p>

          <p className="mt-4 p-2">SIMILAR USERS ALGORITHM</p>

          <p className="mt-4 p-2">
            The similar users algorithm works by taking your user profile and
            building a weighted distribution of other users, each assigned a
            positive-integer score. For any given user, the scoring works by
            computing the intersection set of liked fragments between the given
            user and yourself. Add the cardinality of the liked intersection set
            to the score. Next, we compute a second set - the intersection set
            of all saved fragments between the given user and yourself - Add the
            cardinality of the saved intersection set multiplied by 2 to the
            running score. We have now computed the final similarity score
            between a given user and yourself. The point of the algorithm is to
            build a score distribution of users with mutual interest.
          </p>

          <p className="mt-4 p-2">
            One important distinction to make is that the implementation of the
            similar users algorithm builds the user distribution by processing
            your liked and saved fragments first in order to induce the
            discovery of similar users. We do NOT, for instance, run a linear
            pass through all users. This would be a highly inefficient use of
            server resources.
          </p>

          <p className="mt-4 p-2 font-semibold">
            MESSAGES MODAL, USER SEARCH BAR
          </p>

          <p className="mt-4 p-2">
            The second search feature of this application is located in the
            Messages modal. You can navigate to the messages modal by selecting
            the Messages Icon tab in the Side Navigation Bar (tablet + desktop
            view) or Footer Navigation Bar (mobile view). This second search bar
            is specialized for searching users only.
          </p>
        </>
      </CollapsibleSection>

      {/* VIEWS, LIKES, & COMMENT THREADS */}
      <CollapsibleSection headerText={"5) Views, Likes, & Comment Threads"}>
        <>
          <p className="mt-4 p-2">
            Once a fragment has been uploaded to the server, it is shared with
            the general public. It is imperative to store records of user
            engagement for purposes of content personalization (such as our
            crystal recommendations algorithm in the previous section) and
            maximizing user interactability. This application implements and
            maintains 3 types of user engagement records for a given (public)
            fragment: Views, Likes, and Comments.
          </p>

          <p className="mt-4 p-2 font-semibold">VIEWS & LIKES</p>

          <p className="mt-4 p-2">
            A View is the most primitive form of user-to-fragment engagement.
            They are recorded automatically the moment that a user clicks a
            Fragment Card and navigates to the corresponding Fragment Details
            Page (route: "/fragment/[fragmentId]"). Once a fragment view is
            recorded, it is stored permanently on the server. In addition, the
            system also maintains a user-fragment-specific count of views. This
            count field accomplishes 2 goals: Avoid counting duplicate views of
            a fragment (each Fragment view corresponds to a distinct user) and
            supplies nuance to the usage of the view metric. i.e., a single view
            of a fragment likely indicates mundance user browsing whereas
            multiple views of the same fragment may indicate intrigue of the
            art.
          </p>

          <p className="mt-4 p-2">
            A Like is a strong form of user-to-fragment engagement. They are
            recorded the moment that a user presses the Heart icon of a Fragment
            in the corresponding Fragment Details page. A Like may be toggled on
            or off depending on the previous state. Typically, likes are
            weighted more strongly than views in this application with respect
            to user engagement or interest.
          </p>

          <p className="mt-4 p-2 font-semibold">COMMENTS</p>

          <p className="mt-4 p-2">
            Comments are the most complex form of user-to-fragment engagement.
            This application implements a comment section system that enables
            creating entire comment threads by organizing multiple chains of top
            level comments and corresponding replies for any given fragment. You
            can comment, or reply to a comment, on a fragment by clicking the
            Comment Bubble Icon on the bottom toolbar of the Fragment Details
            Card in the Fragment Details Page. This opens a Comments Modal. For
            a more technical or detailed dive into how the comments section was
            implemented, visit the developer notes.
          </p>

          <p className="mt-4 p-2 font-semibold">COMMENT LIKES</p>

          <p className="mt-4 p-2">
            This application supports liking comments, in addition to liking
            fragments. To like a comment, navigate to the comments section of a
            given fragment, find any comment, or reply, that you like and click
            its Heart Icon. Much like a typical Fragment Like, you can toggle a
            Comment Like on or off depending on the previous state. As of now,
            the system does not leverage a Comment Like in any of its backend
            routines or algorithms, but its a cheap and effective way to give
            user-to-user feedback.
          </p>
        </>
      </CollapsibleSection>

      {/* MESSAGE USERS */}
      <CollapsibleSection headerText={"6) Message Users"}>
        <>
          <p className="mt-4 p-2">
            The messages feature can be accessed by clicking the Messages Icon
            in the Side Navigation Bar (tablet + desktop view) or the Footer
            Navigation Bar (mobile view). Selecting the Messages Icon triggers a
            Messages Modal. The content of the Messages Modal is split into 2
            columns. The column on the right displays the current, active
            Conversation. The column on the left features your previous, recent
            Conversations and a specialized User Search feature.
          </p>

          <p className="mt-4 p-2">
            When the Search Bar query input is empty, the left column defaults
            to the initial state, which renders your previous and recent
            Conversations that you've had. As you type your query input into the
            Messages Modal Search Bar, the left column replaces your
            Conversations list with a distinct list of candidate User matches.
            This mental model aligns with the Header Search Bar + Modal feature.
            Note that the Messages Search feature processes your query and
            searches the User database collection only.
          </p>

          <p className="mt-4 p-2">A couple clarifications to make:</p>

          <ul className="list-disc mt-4 pl-6">
            <li>
              Search engine will discover all users that match your query,
              regardless if you have a stored conversation with them or not
            </li>
            <li>
              Selecting a matched user from your search dropdown does not
              automatically create a conversation record. A message must be sent
              between a pair of users in order for a conversation to be
              instantiated in the system
            </li>
          </ul>
        </>
      </CollapsibleSection>

      {/* RANK */}
      <CollapsibleSection headerText={"7) Rank"}>
        <>
          <p className="mt-4 p-2">
            An official rank system will be implemented in the application in an
            upcoming update. The rank will be given to fragments, not to users.
            A fragment's ranks will be performanced based. There are 6 main
            tiers, each containing a further 6 subranks for a total of 36
            possible titles. The ranks from lowest to highest are as follows:
          </p>

          <ul className="list-disc mt-4 pl-6">
            <li>Quartz VI - Quartz I</li>
            <li>Topaz VI - Topaz I</li>
            <li>Amethyst VI - Amethyst I</li>
            <li>Jade VI - Jade I</li>
            <li>Diamond VI - Diamond I</li>
            <li>Onyx VI - Onyx I</li>
          </ul>

          <p className="mt-4 p-2">
            Achieving each rank, or tier, is point-based. That is, there is a
            minimum number of points (threshold) that a fragment must attain in
            order to reach any particular rank. Points are rewarded from
            weighted user engagement metrics, such as views, likes, comments,
            and saves.
          </p>

          <p className="mt-4 p-2">
            Rank progression will be formulaic. For the first iteration, rank
            thresholds will be computed as a discrete quadratic function. More
            specifically:
          </p>

          <ul className="list-disc mt-4 pl-6">
            <li>Let r index any subrank such that: r = 0 ... 35</li>
          </ul>

          <p className="mt-4 p-2">
            Then the lower points threshold for any subrank r will be computed
            as:
          </p>

          <ul className="list-disc mt-4 pl-6">
            <li>lower_threshold(r) = C * r^2</li>
            <li>
              where C is some system-adjusted scalar- possibly a function of how
              large the user database is
            </li>
          </ul>

          <p className="mt-4 p-2">
            This progression makes higher ranks more difficult to attain at a
            quadratic rate. To make this very clear, we'll run a couple examples
            below:
          </p>

          <p className="mt-4 p-2 font-semibold">EXAMPLE 1: QUARTZ 6</p>

          <ul className="list-disc mt-4 pl-6">
            <li>r = 0</li>
            <li>points threshold is 0</li>
            <li>system rewards Quartz 6 to any fragment automatically</li>
          </ul>

          <p className="mt-4 p-2 font-semibold">EXAMPLE 2: QUARTZ 1</p>

          <ul className="list-disc mt-4 pl-6">
            <li>Suppose that the system multiplier C = 10</li>
            <li>r = 5 implies that lower_threshold(5) = 10 * 5^2 = 250</li>
            <li>
              system rewards Quartz 1 to any fragment that achieves score 250 or
              higher
            </li>

            <li className="mt-4">This can be achieved in many ways... </li>
            <ul className="list-disc pl-6">
              <li>If 1 view yields 1 point, then all you need is 250 views</li>
              <li>
                And If 1 like yields 2 points, then all you need is 125 likes
              </li>
              <li>
                Or a combination of them, such as, 50 likes and 150 unique
                views, which would satisfy the 250 threshold
              </li>
            </ul>
          </ul>
        </>
      </CollapsibleSection>
    </div>
  );
};

export default FeaturesPage;
