// @ts-ignore
import { NacnWidget } from "./widget/components/NacnWidget";

// import "../dist/main.css";
import "./App.css";

// const data = {
//   sources: [
//     {
//       tab: "TEXT",
//       label: "Texte manuel",
//       items: ["mon nouveau content", "deuxieme text"],
//     },
//   ],
//   result: {
//     article: [
//       {
//         value: "version1",
//         label: "version 1",
//         content:
//           "<p>À compter du 1er janvier 2026, toutes les entreprises proposant des services de livraison à domicile en milieu urbain doivent adopter des pratiques respectueuses de l’environnement et de la tranquillité publique. Les véhicules utilisés pour les livraisons dans les centres-villes devront être exclusivement électriques ou hybrides rechargeables, afin de limiter les émissions polluantes et le bruit. Les entreprises de livraison sont également tenues de regrouper les colis et d’optimiser leurs tournées pour réduire la circulation inutile et les embouteillages.</p>\n\n ",
//         isUsed: true,
//       },
//     ],
//     title: [],
//     picture: [],
//   },
// };
const data = {
  sources: [{ tab: "TEXT", label: "Texte manuel", items: ["test contenu"] }],
  result: {
    article: [
      {
        value: "version1",
        label: "version 1",
        content:
          "À compter du 1er janvier 2026, toutes les entreprises proposant des services de livraison à domicile en milieu urbain doivent adopter des pratiques respectueuses de l’environnement et de la tranquillité publique. Les véhicules utilisés pour les livraisons dans les centres-villes devront être exclusivement électriques ou hybrides rechargeables, afin de limiter les émissions polluantes et le bruit. Les entreprises de livraison sont également tenues de regrouper les colis et d’optimiser leurs tournées pour réduire la circulation inutile et les embouteillages.\n\n     Les communes ont la responsabilité de mettre en place des zones de livraison réglementées et des horaires précis afin de limiter les nuisances sonores, particulièrement en soirée et la nuit. Les plateformes de livraison sont encouragées à collaborer avec les commerces locaux pour mutualiser les trajets et favoriser l’implantation de points de retrait accessibles à pied ou à vélo.\n\n    Tout manquement aux obligations fixées par le présent article pourra entraîner des sanctions administratives, incluant des amendes et, en cas de récidive, la suspension temporaire de l’autorisation d’exploiter le service dans la commune concernée. Les modalités précises d’application seront définies par arrêté royal après concertation avec les Régions et les représentants du secteur.",
        isUsed: true,
      },
    ],
    title: [
      {
        value: "version1",
        label: "version 1",
        content: "Mon titre proposé",
        isUsed: true,
      },
    ],
    picture: [
      {
        value: "version1",
        label: "version 1",
        content: "",
        media: {
          id: 45065,
          url: "https://s3.tamtam.pro/local/storage/media/IMAGE/45065/3fc318418605a7ddc8097f2d260042466c48aee6.png",
        },
        isUsed: true,
      },
    ],
  },
};

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
          aiUrl="https://ai.staging.tamtam.pro"
          blogSearchUrl="https://seo.tamtam.pro/blog/_msearch"
          lng="fr"
          organizationId={9}
          onPost={(e: any) => console.log("onPost", e)}
          onPostHistory={(e: any) => console.log("History", e)}
          initialHistory={data}
        />
      </div>
    </>
  );
}

export default App;
