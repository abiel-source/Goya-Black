import CollapsibleSection from "@/components/view/CollapsibleSection";

const AboutPage = () => {
  return (
    <div className="px-12 py-8">
      <h1 className="text-center text-2xl font-bold mt-10 mb-4">About</h1>

      <p className="text-center text-sm">
        A little bit about myself, my goals with this project,
      </p>
      <p className="text-center text-sm">
        and the references I used to build the application.
      </p>

      <CollapsibleSection headerText={"What is a Fragment? Crystal?"}>
        <>
          <p className="mt-4 p-2">
            A fragment and crystal are just fancy terms that refer to either an
            image or collection of images (album, basically). It's just a fun
            way to thematize the application. Think Pinterest's "Pins" and
            "Boards" counterparts... But a crystal can be broken down into many
            shards, or, fragments...
          </p>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"About the Developer"}>
        <>
          <p className="mt-4 p-2">
            Hello World! I'm a recent graduate from Simon Fraser University in
            Computer Science, AI Specialization. I built this project in my
            spare time to further hone my full-stack development skills. I have
            professional experience in Technical Project Management, Product
            Engineering, Full-Stack Software Development, and Machine Learning.
          </p>

          <p className="mt-4 p-2">Some fun personal facts about me:</p>
          <ul className="list-disc pl-6 mt-4">
            <li>
              I love first person shooters (diamond rank in Halo Infinite)
            </li>
            <li>I am a former starcraft 2 prodigy (diamond rank at age 11)</li>
            <li>
              I play online chess sometimes (peak rating 2150-2200 on chess.com
              and lichess - best format is bullet)
            </li>
            <li>I enjoy reading about dinosaurs or evolution</li>
          </ul>

          <p className="mt-4 p-2">
            I'm very friendly! Feel free to reach out or check out my other
            projects:
          </p>

          <ul className="list-disc pl-6 mt-4">
            <li>MY EMAIL CONTACT: abielkim.tech@gmail.com</li>
            <li>
              MY GITHUB:{" "}
              <a href="https://github.com/abiel-source" className="italic">
                https://github.com/abiel-source
              </a>
            </li>
            <li>
              MY LINKTREE:{" "}
              <a href="https://linktr.ee/abielkim" className="italic">
                https://linktr.ee/abielkim
              </a>
            </li>
          </ul>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"About the Application"}>
        <>
          <p className="mt-4 p-2">
            This application is intended to be non-commerical. This is a passion
            project developed with a few very specific goals in mind.
          </p>

          <p className="mt-4 p-2">
            I intentionally did not want to develop anything flashy nor fancy.
            Instead, this project enables me to focus on the fundamentals of
            software engineering and design. No nonsense. Only pure fullstack
            coding.
          </p>

          <p className="mt-4 p-2">
            Some fundamental concepts that I was able to implement in this
            application:
          </p>

          <ul className="list-disc pl-6 mt-4">
            <li>Asynchronous Programming</li>
            <li>Database Model Schema Design & Implementation</li>
            <li>Handling Local State whilst juggling Backend Routines</li>
            <li>Nested Server & Client Components</li>
            <li>
              Processing, Designing, & Implementing Application Routes and URL
              Parameters
            </li>
            <li>Realtime Search Features & Processing User Queries</li>
            <li>
              Developing my own custom Recommendation and Personalization
              Algorithms
            </li>
            <li>User Authentication & Security</li>
            <li>API Programming & Server Actions</li>
            <li>Backend Setup, Maintenance & Environment Variables</li>

            <li>Rendering Optimizations, Pagination</li>
            <li>Dynamic UI Development</li>
            <li>React Hooks, State, and Effects</li>
            <li>Custom CRUD Design & Development</li>
            <li>Tailwind Fundamentals & Dynamic Styling</li>
            <li>Managing Next JS Caching</li>
            <li>Props, Callbacks & React Fundamentals</li>

            <li>Documentation</li>
            <li>Design: Editing custom Logos & Icons in Figma</li>
          </ul>

          <p className="mt-4 p-2">The Backend Stack:</p>

          <ul className="list-disc pl-6 mt-4">
            <li>MongoDB + Mongoose</li>
            <li>Cloudinary</li>
            <li>Google OAuthentication + Next Authentication</li>
            <li>Vercel</li>
          </ul>

          <p className="mt-4 p-2">
            I plan on maintaining this project and developing it even further
            over a long-term basis. My plans for the future include:
          </p>

          <ul className="list-disc pl-6 mt-4">
            <li>Major UI & Design Revisions</li>
            <li>Industry-grade Optimizations</li>
            <li>
              Improving current features (recommendation algorithms, search
              engines, realtime comment threads, messaging)
            </li>
            <li>
              Developing more features (post videos, profile customizations,
              editing mode, ranks, ...)
            </li>
            <li>Database Schema Revisions to improve search speed</li>
            <li>Codebase Refactoring & Organization</li>
            <li>etc.</li>
          </ul>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"Inspirations & References"}>
        <>
          <p className="mt-4 p-2">
            As you may or may not have noticed, this application was heavily
            inspired by 3 specific applications: Pinterest, Instagram, and
            Twitch. I did not access any source code or clone source codes, but
            rather, I spent time to study how these 3 applications behave from a
            specific use-case perspective, then implemented my own variant of
            the corresponding feature/component/behaviour.
          </p>

          <ul className="list-disc pl-6 mt-4">
            <li>
              Pinterest - Routes, Fragment/Crystal Creation Flow, Masonry
              Gallery, Modal Positioning, Side Navigation Bar
            </li>
            <li>
              Instagram - Fragment Details Card, Fragment Details Icon Toolbar
            </li>
            <li>Twitch - Top Header Navigation Bar</li>
          </ul>

          <p className="mt-4 p-2 font-semibold">
            PINTEREST: REVERSE-ENGINEERING ROUTES
          </p>

          <p className="mt-4 p-2">
            For instance, I clicked around on Pinterest, and sort of
            reverse-engineered how they route the user around when browsing
            pins. I did this by observing the URLs. I saw that they implemented
            a kind of infinite-scrolling behaviour by routing the user from the
            home page to a details page, then browse infinitely by cycling
            between details pages, like a reflexive graph node. Other routes
            then feed into this cycle, like a cyclical graph. I took this mental
            model, then implemented my own infinite-browsing routing behaviour,
            which became the route set that defines this application now.
          </p>

          <p className="mt-4 p-2">
            The Fragment & Creation Process Workflows were influenced by
            Pinterest as well. That's where the whole idea of a Seed Crystal
            Modal component - essentially the quick-add pop-up modal for your
            crystal that triggers automatically when creating a crystal for the
            first time - came from. Some of my major features came from
            reverse-engineering the behaviour of an application (not by a source
            code, but pure use-case observation) and then implementing my own
            custom routing.
          </p>

          <p className="mt-4 p-2">
            Actually, the behaviour of the Header search feature follows a
            similar story. More specifically, how the Header search bar + modal
            has an initial state + realtime query prediction state. This wasn't
            something I read somewhere, but rather, observed how Pinterest's
            search bar mechanics worked from clicking around on their website.
            Then, I reverse engineered my own variant of the search mechanic,
            quickly realizing that the state toggles depending on if the Search
            Bar input state is empty or not.
          </p>

          <p className="mt-4 p-2 font-semibold">
            INSTAGRAM: MODALS, MESSAGE DESIGN & SEARCH ENGINE BEHAVIOUR
          </p>

          <p className="mt-4 p-2">
            Pinterest was the primary reference. However, I took note of
            Instagram and Twitch too. My application's use of modals was heavily
            influenced by the behaviour of Instagram, for instance. When I was
            designing & developing the UI for the Comment Section of a Fragment,
            I was unsure of where or how to place a Comments Section without
            compromising UX, UI and/or overloading a component with state +
            asynchronous server fetches. Thats when I turned to Instagram, and
            saw that their comment section opens a full-screen Comments Modal! A
            compartmentalized UI component that doubles as a separation of state
            + server fetching... I ended up liking the design so much that I
            made the Messages feature accessible via a full-screen modal as
            well.
          </p>

          <p className="mt-4 p-2">
            Another way that Instagram influenced this application was through
            its Messages Modal + Search Bar - the one where you search for users
            in the Messages Modal (NOT the Header Search Bar). The design of the
            Messages modal was loosely inspired by Instagram with the 2-column
            separation between your conversation records + active conversation
            thread. Most of the inspiration here was the Search Bar behaviour
            though, where I reverse engineered user-lookup, conversation
            initialization behaviour, and the rendering of a query-to-user
            lookup predictions list.
          </p>

          <p className="mt-4 p-2">
            A lot of my UI was inspired by Instagram too, such as the Fragment
            Details Page Component, Icon Toolbar set, and Message/Comment
            bubbles.
          </p>

          <p className="mt-4 p-2 font-semibold">
            TWITCH: HEADER, MENU DROPDOWNS
          </p>

          <p className="mt-4 p-2">
            My SideNav/Header Menu dropdowns? That came from observing Twitch's
            header icon toolbar set. I liked how Twitch's design frees up space
            by compacting information into their Navigation Bars + Menu
            Dropdowns. I wanted to replicate that feel without taking too much
            away from the simplicity of a Pinterest-like design, whose Header
            Bars and Toolbar sets are simpler. But yeah, the menu dropdowns in
            my header, side nav, and positioning of my header search bar were
            influenced by Twitch's UI.
          </p>
        </>
      </CollapsibleSection>
    </div>
  );
};

export default AboutPage;
