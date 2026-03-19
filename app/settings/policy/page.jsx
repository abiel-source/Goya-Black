import CollapsibleSection from "@/components/view/CollapsibleSection";

const PolicyPage = () => {
  return (
    <div className="px-12 py-8">
      <h1 className="text-center text-2xl font-bold mt-10 mb-4">
        Privacy Policy
      </h1>

      <p className="text-center text-sm">
        A high-level document specifying how your data is used
      </p>

      <CollapsibleSection headerText={"1) Information we Collect"}>
        <>
          <p className="mt-4">
            When you sign in using your Google account, this application may
            access your email address and basic profile information provided by
            Google. This information is used solely for authentication and
            account identification within the application. i.e., Your
            information is not shared nor sold outside of the application.
          </p>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"2) Google OAuth Scopes"}>
        <>
          <p className="mt-4">
            This application uses Google authentication to request the following
            information:
          </p>
          <ul className="list-disc pl-6">
            <li>userinfo.email - pimary Google account email address</li>
            <li>
              userinfo.profile - basic profile information i.e., name or profile
              image if available
            </li>
          </ul>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"3) How Your Data is Used"}>
        <>
          <p className="mt-4">Collected information is used to:</p>
          <ul className="list-disc pl-6">
            <li>Authenticate users</li>
            <li>
              Recommend personalized content based on your activities - i.e.,
              similar users, recommended crystals
            </li>
            <li>Associate uploaded content with user accounts</li>
          </ul>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"4) Data Storage"}>
        <>
          <p className="mt-4">
            User account information and uploaded content are securely stored on
            application servers. Our stack is:
          </p>
          <ul className="list-disc pl-6">
            <li>Cloudinary - secure image hosting service</li>
            <li>
              Google Authentication + Next Authentication - authentication
            </li>
            <li>MongoDB Atlas - central database</li>
            <li>Vercel - application hosting</li>
          </ul>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"5) Data Sharing"}>
        <>
          <p className="mt-4">
            We repeat that this application does not sell, trade, or share your
            personal information with third party services (except as required
            to run the application).
          </p>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"6) Data Deletion"}>
        <>
          <p className="mt-4">
            Deleted information is not retained by the application. User account
            and/or content deletion is permanent.
          </p>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"7) Policy Changes"}>
        <>
          <p className="mt-4">
            Changes to this policy is highly unlikely. However, in the event of
            a policy change, continued use of the application entails acceptance
            of any policy updates.
          </p>
        </>
      </CollapsibleSection>

      <CollapsibleSection headerText={"8) Contact"}>
        <>
          <p className="mt-4">
            For any questions or concerns feel free to contact the developer via
            email at: <span className="italic">abielkim.tech@gmail.com</span>
          </p>
        </>
      </CollapsibleSection>
    </div>
  );
};

export default PolicyPage;
