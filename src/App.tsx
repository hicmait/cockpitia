// @ts-ignore
import { NacnWidget } from "./widget/components/NacnWidget";

// import "../dist/main.css";
import "./App.css";

function App() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: "70px",
          right: "20px",
          zIndex: "999",
        }}
      >
        <NacnWidget
          appTarget="ARTICLE"
          isHidden={false}
          token="b03f904a45843d832720e1ead56705c45ac9463a"
          apiUrl="http://local.api.tamtam.pro"
          aiUrl="https://service.ai.api.tamtam.pro"
          blogSearchUrl="https://seo.tamtam.pro/blog/_msearch"
          lng="fr"
          organizationId={9}
        />
      </div>
    </>
  );
}

export default App;
