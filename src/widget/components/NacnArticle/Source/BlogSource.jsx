import { useState } from "react";
import debounce from "lodash.debounce";

import { fetchSearch } from "../../../api";
import styles from "../NacnArticle.module.scss";
import IconLink from "../../../icons/IconLink";
import IconSpinner from "../../../icons/IconSpinner";
import IconPlus from "../../../icons/IconPlus";
import IconTrash from "../../../icons/IconTrash";
import IconCheck from "../../../icons/IconCheck";
import IconClose from "../../../icons/IconClose";

const BlogSource = ({
  blogSearchUrl,
  organizationId,
  lng,
  blogSources,
  setBlogSources,
  currentIndex,
  setCurrentIndex,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [highlightedTags, setHighlightedTags] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [results, setResults] = useState({ article: [] });

  const groupResultsByEntities = (results, entities) => {
    let groups = {};
    entities.forEach((entity) => (groups[entity] = []));

    let tags = [];
    for (let i = 0; i < results.length; i++) {
      let document = results[i];
      let entityName = document.entity;
      if (entities.includes(entityName)) {
        if (entityName === "tag") {
          groups[entityName].push(document.tagName);
        } else {
          groups[entityName].push(document);
        }
      }
    }
    return groups;
  };

  const debouncedSearchLoadResults = debounce((search) => {
    setIsFetching(true);
    // fetchSearch(blogSearchUrl, search, lng, [organizationId])
    //   .then((resp) => {
    //     if (resp.data.data.length > 0) {
    //       const groupedResults = groupResultsByEntities(resp.data.data, [
    //         "article",
    //         "tag",
    //       ]);
    //       setResults(groupedResults);
    //       let tabs = [];
    //       if (groupedResults.article?.length > 0) {
    //         tabs.push("Article");
    //       }
    //       if (groupedResults.tag?.length > 0) {
    //         setHighlightedTags(groupedResults.tag);
    //       }
    //       setIsFetched(true);
    //     } else if (resp.error) {
    //       setResults({});
    //     }
    //     setIsFetching(false);
    //   })
    //   .catch(() => {
    //     setIsFetching(false);
    //     setResults({});
    //   });

    let data = [
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/52550/64481e249bd00cc0831b87198b296640de0989c9.jpeg",
        publishedAt: "2025-12-04T05:30:00+00:00",
        organization: 9,
        id: 29331,
        title:
          "Déficit, dépenses, fiscalité: les économistes débattent face au mur budgétaire belge",
        url: "deficit-depenses-fiscalite-les-economistes-debattent-face-au-mur-budgetaire-belge",
        tags: [
          "Profession",
          "Social",
          "Travail",
          "Indépendants",
          "Entreprises",
          "Budget",
          "Deficit public",
          "accord budgétaire",
          "Dépenses publiques",
          "Recettes fiscales",
        ],
        highlights: {
          content: [
            "Le président de l'Ordre, <em>Emmanuel</em> Degrève, a fermement rappelé que « l'Ordre des experts-comptables est",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/50009/dd481facb004a42ccd947d3fee9f4a9057abe0f2.jpeg",
        publishedAt: "2025-07-25T04:09:00+00:00",
        organization: 9,
        id: 27988,
        title:
          "Prix de transfert: quand le fisc belge tente de revoir un taux d’intérêt intragroupe « at arm’s length »",
        url: "prix-de-transfert-quand-le-fisc-belge-tente-de-revoir-un-taux-dinteret-intragroupe-at-arms-length-",
        tags: [
          "Financement",
          "taux",
          "dividendes",
          "Prix de transfert",
          "avantages anormaux ou bénevoles",
        ],
        highlights: {
          content: [
            "Denis-<em>Emmanuel</em> Philippe[1] Abus de la Directive mère-filiale (PSD RDT) : nouvelle application jurisprudentielle",
            "Louvain, 6 juin 2025) – Denis-<em>Emmanuel</em> Philippe",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/48974/2d8d48bd44a2ad5912b152969d3897cedb79d865.jpeg",
        publishedAt: "2025-06-09T04:07:00+00:00",
        organization: 9,
        id: 27362,
        title:
          "Les déboires des sicav luxembourgeoises avec le fisc et la justice belge",
        url: "les-deboires-des-sicav-luxembourgeoises-avec-le-fisc-et-la-justice-belge",
        tags: [
          "Luxembourg",
          "Convention préventive de double imposition (CPDI)",
          "Fiscalité internationale",
          "Convention préventive de double imposition belgo-luxembourgeoise",
          "SICAV",
          "SICAV SIF luxembourgeoise",
          "Planification patrimoniale",
          "Organisme de placement collectif (OPC)",
          "Précompte mobilier réduit",
          "dividendes",
          "Double imposition",
        ],
        highlights: {
          content: [
            "sont pas de nature à rassurer les fonds luxembourgeois souhaitant faire des affaires en Belgique…Denis-<em>Emmanuel</em>",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/47836/219dd8e3d93d5affb009528e5826ea1fa14cf162.jpeg",
        publishedAt: "2025-03-31T14:00:00+00:00",
        organization: 9,
        id: 26601,
        title:
          "Grève aujourd’hui, dialogue demain pour ressouder les liens entre nos instances et réinventer notre futur",
        url: "greve-aujourdhui-dialogue-demain-pour-ressouder-les-liens-entre-nos-instances-et-reinventer-notre-futur",
        tags: [
          "Profession",
          "administration fiscale",
          "avenir",
          "Futur",
          "relation avec l'administration",
          "défense professionnelle",
        ],
        highlights: {
          content: [
            "sont quelque peu apaisés, et qu’un souffle nouveau accompagne le début du mandat de notre confrère  <em>Emmanuel</em>",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/47808/e99e0a55048ed11c227c4312db8bbcfbe4a73d8f.jpeg",
        publishedAt: "2025-03-29T05:04:00+00:00",
        organization: 9,
        id: 26574,
        title: "Augmenter les impôts est-il inéluctable?",
        url: "augmenter-les-impots-est-il-ineluctable",
        tags: [
          "Belgique",
          "Réforme",
          "France",
          "Réforme fiscale",
          "Arizona",
          "Pression fiscale",
          "Impôt des personnes physiques",
          "Impôt des sociétés",
          "OCDE",
        ],
        highlights: {
          content: [
            "Son président, <em>Emmanuel</em> Macron, n’a jamais été un adepte de la réduction du rôle de l’État et des impôts",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/45528/d5d073da929468483e46c5ed119db48ec50b0306.jpeg",
        publishedAt: "2024-11-25T12:26:00+00:00",
        organization: 9,
        id: 25184,
        title:
          "Mondialisation (1ère partie): la vérité derrière les idées de Trump",
        url: "mondialisation-1ere-partie-la-verite-derriere-les-idees-de-trump",
        tags: [
          "Social",
          "Travail",
          "Europe",
          "Bien-être",
          "Chine",
          "mondialisation",
          "Réindustrialisation",
          "Industrie",
          "Donald trump",
          "Etats-Unis (USA)",
        ],
        highlights: {
          content: [
            "sociales), mais je voudrais partager un sentiment qui m’habite depuis que j’ai lu le dernier ouvrage d’<em>Emmanuel</em>",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/45214/1401fc662629dc37204440e257b9e8b227dff87b.jpeg",
        publishedAt: "2024-11-12T12:49:00+00:00",
        organization: 9,
        id: 24988,
        title:
          "​Billet de Philadelphie, ou ce que je partage des USA en ce mois de novembre (II)",
        url: "billet-de-philadelphie-ou-ce-que-je-partage-des-usa-en-ce-mois-de-novembre-ii",
        tags: [
          "Travail",
          "Russie",
          "Démocratie",
          "Capital",
          "Capitalisme",
          "Emmanuel Todd",
          "Protestant",
          "Brics",
        ],
        highlights: {
          content: [
            "Dans son dernier opus, La Défaite de l’Occident, <em>Emmanuel</em> Todd dresse un paysage apocalyptique du monde",
            "À noter que Max Weber (1864-1920), qu’<em>Emmanuel</em> Todd ne cite pas, avait lui aussi critiqué la dérive de",
            "<em>Emmanuel</em> Todd s’essaye à expliquer pourquoi tant de pays, aux régimes démocratiques variés, s’alignent",
            "sont désindustrialisées au profit d’un monde qui les maintient desormais en vassaux.La conclusion d’<em>Emmanuel</em>",
          ],
          tags: ["<em>Emmanuel</em> Todd"],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/44878/00f284d132a1c9e3dce78f9e149cd553c22eda47.jpeg",
        publishedAt: "2024-11-07T05:00:00+00:00",
        organization: 9,
        id: 24810,
        title: "France : la montée de la droite anti-libérale",
        url: "france-la-montee-de-la-droite-anti-liberale",
        tags: [
          "Social",
          "Belgique",
          "Europe",
          "finances",
          "Gouvernement",
          "Augmentation",
          "France",
        ],
        highlights: {
          content: [
            "Marché intérieur de l’Union européenne, il n’a jamais rien fait pour libéraliser celui-ci.En somme, <em>Emmanuel</em>",
            "des finances publiques, causé lui-même par des dépenses publiques déraisonnables des gouvernements d’<em>Emmanuel</em>",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/44834/f17803da755ba8eadd7aa3ea872a88bcaa17d2bd.jpeg",
        publishedAt: "2024-11-06T06:00:00+00:00",
        organization: 9,
        id: 24780,
        title:
          "Exode d'une entreprise belge : des dividendes taxés pour les actionnaires ?",
        url: "exode-dune-entreprise-belge-des-dividendes-taxes-pour-les-actionnaires-",
        tags: [
          "Impôt des sociétés",
          "Immobilier",
          "Social",
          "Droit des sociétés",
          "2023",
          "Belgique",
          "SPF Finances",
        ],
        highlights: {
          content: [
            "Van Hees du 19 décembre 2023).Denis-<em>Emmanuel</em> Philippe (Avocat-associé, Bloom Law) – Olivier Willez (Avocat-associé",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/44188/35b70e70316bcf90a87dd9ec5921a364bf23a3fc.jpeg",
        publishedAt: "2024-09-23T07:30:00+00:00",
        organization: 9,
        id: 24403,
        title: "L’Europe : grandir ou agoniser",
        url: "leurope-grandir-ou-agoniser",
        tags: [
          "Social",
          "Digitalisation",
          "Bruxelles",
          "Europe",
          "Compétitivité",
          "Innovation",
          "Croissance économique",
        ],
        highlights: {
          content: [
            "Europe qui nous fera grandir » qu’a publié tout récemment le juriste, avocat et professeur Philippe-<em>Emmanuel</em>",
            "Mario Draghi parle d’agonie lente, Philippe-<em>Emmanuel</em> Partschde « bilan en péril », en prenant comme indicateur",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/44064/d2011f14a9ad81f6e30a4fe800b5664f334fb898.jpeg",
        publishedAt: "2024-09-15T04:00:00+00:00",
        organization: 9,
        id: 24330,
        title:
          "Souveraineté : et si celle-ci démarrait avec l'instauration d'un bouclier fiscal?",
        url: "souverainete-et-si-celle-ci-demarrait-avec-linstauration-dun-bouclier-fiscal",
        tags: [
          "finances",
          "Europe",
          "Gouvernement",
          "Droits",
          "France",
          "Dette publique",
          "droit",
        ],
        highlights: {
          content: [
            "perte de souveraineté, mais elle résulterait tout simplement du fait que les gouvernements successifs d’<em>Emmanuel</em>",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/43741/2a8974c384551cc1784fe387e2a2c8bfcc7f6024.jpeg",
        publishedAt: "2024-08-23T09:24:00+00:00",
        organization: 9,
        id: 24136,
        title:
          "La saga de l'été 2024, les SCI françaises translucides, la taxe caïman, les constructions juridiques. Pas de revenu cadastral à solliciter!",
        url: "la-saga-de-lete-2024-les-sci-francaises-translucides-la-taxe-caiman-les-constructions-juridiques.-pas-de-revenu-cadastral-a-solliciter",
        tags: [
          "Immobilier",
          "SPF Finances",
          "SCI française",
          "Transparence fiscale",
          "Impôt des sociétés",
          "Taxe Caïman",
          "Fiscalité internationale",
          "Impôt des personnes physiques",
          "Planification patrimoniale",
        ],
        highlights: {
          content: [
            "Denis-<em>Emmanuel</em> Philippe Associé Bloom Law -Olivier Willez dans le numéro 25-année 2024 semaine du 15",
            'fictif basé sur le revenu cadastral devra être renseigné dans la déclaration IPP" 25.12.2023 Denis-<em>Emmanuel</em>',
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/43522/696559b6b8fa61b5aa183fb1c89cbddf52c7080d.jpeg",
        publishedAt: "2024-08-12T06:00:00+00:00",
        organization: 9,
        id: 23980,
        title:
          "Conférence « Next Level MaaS – La mobilité en tant que service aujourd’hui et demain » | 17 septembre 2024",
        url: "conference-next-level-maas-la-mobilite-en-tant-que-service-aujourdhui-et-demain-17-septembre-2024",
        tags: [
          "2024",
          "Septembre",
          "Conseil",
          "service",
          "Mobilité",
          "Social",
          "concretisation",
        ],
        highlights: {
          content: [
            "et café9.30Mot d’introductionPatrick Dupriez, Président du Conseil fédéral du Développement durable<em>Emmanuel</em>le",
            "néerlandais des infrastructures et de la gestion de l'eau10.35Présentation des Smart Mobility Awards<em>Emmanuel</em>le",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/43317/dc035f08e2b2505c63cbae75ca92ce7a78531cb6.jpeg",
        publishedAt: "2024-07-27T07:17:00+00:00",
        organization: 9,
        id: 23869,
        title:
          "Un contribuable peut-il se faire redresser lorsqu'il n'est pas partie à tous les actes susceptibles d'abus?",
        url: "un-contribuable-peut-il-se-faire-redresser-lorsquil-nest-pas-partie-a-tous-les-actes-susceptibles-dabus",
        tags: [
          "Règles Anti-abus",
          "Impôt des personnes physiques",
          "Cour de Cassation",
          "Fiscalité internationale",
          "Fraude fiscale",
        ],
        highlights: {
          content: [
            "clarification attendue dans un arrêt ici résumé et commenté par deux spécialistes en la matière,  Denis-<em>Emmanuel</em>",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/42978/8c952099250e2b5dc755f4710b2dc0975bb4b44a.jpeg",
        publishedAt: "2024-07-09T15:01:00+00:00",
        organization: 9,
        id: 23654,
        title:
          "L’éternel problème de la double imposition des dividendes de source étrangère",
        url: "leternel-probleme-de-la-double-imposition-des-dividendes-de-source-etrangere",
        tags: ["Impôt", "Précompte"],
        highlights: {
          content: [
            "solutionnera donc pas l’éternel problème de la double imposition des dividendes de source étrangère…Denis-<em>Emmanuel</em>",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/42852/8eeca675b101a7094d6a2a9bb0e3c8cb9ec69751.jpeg",
        publishedAt: "2024-07-03T06:57:00+00:00",
        organization: 9,
        id: 23565,
        title:
          "Un sentiment de déjà-vu : les leçons du passé peuvent-elle nous permettre de comprendre notre présent?",
        url: "un-sentiment-de-deja-vu-les-lecons-du-passe-peuvent-elle-nous-permettre-de-comprendre-notre-present",
        tags: [
          "Europe",
          "France",
          "avenir",
          "Allemagne",
          "Perspectives",
          "capitalisme de déclassement",
        ],
        highlights: {
          content: [
            "Et que penser de la décision d’<em>Emmanuel</em> Macron, dont l’aboutissement sera, au mieux, une France ingouvernable",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/42501/c55e4b26d902ca75059b2b4ad1b8eb5411a7fde4.jpeg",
        publishedAt: "2024-06-15T05:00:00+00:00",
        organization: 9,
        id: 23355,
        title: "Les SCI françaises translucides et la Belgique : le désamour ?",
        url: "les-sci-francaises-translucides-et-la-belgique-le-desamour-",
        tags: [
          "Impôt des sociétés",
          "Immobilier",
          "Impôt des personnes physiques",
          "2021",
          "France",
          "SCI française",
          "Constructions juridiques",
        ],
        highlights: {
          content: [
            "– L’Echo.be – 28.02.2024 – Denis-<em>Emmanuel</em> Philippe & Olivier Willez).",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/42145/e851984388f084d6b6d74bd7d64c7155b959fad5.jpeg",
        publishedAt: "2024-05-25T05:16:00+00:00",
        organization: 9,
        id: 23125,
        title:
          "Échanges d’informations en matière fiscale dans l’UE et secret professionnel des intermédiaires-conseillers fiscaux",
        url: "echanges-dinformations-en-matiere-fiscale-dans-lue-et-secret-professionnel-des-intermediaires-conseillers-fiscaux",
        tags: [
          "Secret professionnel",
          "Échange d'informations",
          "Coopération administrative",
          "Obligation de déclaration",
          "Planification fiscale agressive",
        ],
        highlights: {
          content: [
            "limites, liées au secret professionnel (notamment des avocats), à ces obligations.Explications par Denis-<em>Emmanuel</em>",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/41566/54d55bfbe961a6aead8ba8b240f74c6198fb6a66.jpeg",
        publishedAt: "2024-04-27T05:00:00+00:00",
        organization: 9,
        id: 22745,
        title:
          "ITAA 2024.  Sans démocratie, aucun budget n'emporte de plébiscite. Réagissez à nos côtés !",
        url: "itaa-2024.-sans-democratie-aucun-budget-nemporte-de-plebiscite.-reagissez-a-nos-cotes-",
        tags: [
          "ITAA",
          "Transparence",
          "Budget ITAA",
          "Profession",
          "Conseil de l'ITAA",
          "Assemblée générale ITAA",
          "Démocratie",
          "bugs informatiques",
        ],
        highlights: {
          content: [
            "Dont acte.100% à vos côtés,Gérard Delvaux, Président de l'OECCBB<em>Emmanuel</em> Degrève, Vice-président de l'OECCBB",
          ],
        },
        entity: "article",
      },
      {
        externalUrl: "",
        mediaUrl:
          "https://s3.tamtam.pro/production/storage/media/IMAGE/41466/2e19601464195e0ee129642bb458cd048faee9c4.png",
        publishedAt: "2024-04-18T11:00:00+00:00",
        organization: 9,
        id: 22670,
        title:
          "STOP ! Budget ITAA dans le rouge !  Un signal dangereux avant une probable augmentation de vos cotisations ITAA ?",
        url: "stop-budget-itaa-dans-le-rouge-un-signal-dangereux-avant-une-probable-augmentation-de-vos-cotisations-itaa-",
        tags: [
          "Profession",
          "2024",
          "ITAA",
          "Comptes annuels",
          "cotisation ITAA",
        ],
        highlights: {
          content: [
            "--Gérard Delvaux, Président de l'OECCBB, <em>Emmanuel</em> Degrève, Vice-Président de l'OECCBBEn réalité, jamais",
          ],
        },
        entity: "article",
      },
      {
        avatarUrl:
          "storage/media/IMAGE/40750/AVATAR_9e53b9a683cabad6bf64162d838021053551b7ca.png",
        authorName: "Emmanuel Delannoy",
        authorUrl: "emmanuel-delannoy",
        id: 1434,
        isSpeaker: false,
        userId: 469762,
        highlights: {
          authorName: ["<em>Emmanuel</em> Delannoy"],
        },
        entity: "author",
      },
      {
        avatarUrl:
          "storage/media/IMAGE/31/AVATAR_a838aa75f6239ff4efb921e6dde7adbc3dd7d3d9.png",
        authorName: "Emmanuel Degrève",
        authorUrl: "emmanuel-degreve",
        id: 25,
        isSpeaker: false,
        userId: 8650,
        highlights: {
          authorName: ["<em>Emmanuel</em> Degrève"],
        },
        entity: "author",
      },
      {
        avatarUrl: "",
        authorName: "Emmanuel Braeckmans",
        authorUrl: "emmanuel-braeckmans",
        id: 1566,
        isSpeaker: 0,
        userId: 8163,
        highlights: {
          authorName: ["<em>Emmanuel</em> Braeckmans"],
        },
        entity: "author",
      },
      {
        avatarUrl:
          "storage/media/IMAGE/4984/AVATAR_e52bc05096f3d49d6f3158243ad1109fc5c6b43e.png",
        authorName: "Denis-Emmanuel Philippe",
        authorUrl: "denis-emmanuel-philippe",
        id: 71,
        isSpeaker: false,
        userId: 42049,
        highlights: {
          authorName: ["Denis-<em>Emmanuel</em> Philippe"],
        },
        entity: "author",
      },
      {
        id: 958,
        counter: 6,
        tagName: "Emmanuel Degrève",
        highlights: {
          tagName: ["<em>Emmanuel</em> Degrève"],
        },
        entity: "tag",
      },
      {
        id: 9463,
        counter: 4,
        tagName: "Denis-Emmanuel Philippe",
        highlights: {
          tagName: ["Denis-<em>Emmanuel</em> Philippe"],
        },
        entity: "tag",
      },
      {
        id: 29389,
        counter: 1,
        tagName: "Emmanuel Todd",
        highlights: {
          tagName: ["<em>Emmanuel</em> Todd"],
        },
        entity: "tag",
      },
    ];
    setTimeout(() => {
      const groupedResults = groupResultsByEntities(data, ["article", "tag"]);
      setResults(groupedResults);
      let tabs = [];
      if (groupedResults.article?.length > 0) {
        tabs.push("Article");
      }
      if (groupedResults.tag?.length > 0) {
        setHighlightedTags(groupedResults.tag);
      }
      setIsFetched(true);
      setIsFetching(false);
    }, 2000);
  }, 1000);

  const handleSearchChange = (e) => {
    const tab = [...blogSources];
    tab[currentIndex].search = e.target.value;
    setBlogSources(tab);

    if (e.target.value.length > 2) {
      debouncedSearchLoadResults(e.target.value);
    } else {
      setResults({});
      setHighlightedTags([]);
      setIsFetched(false);
    }
  };

  return (
    <div>
      <ul className={styles.alt_tabs}>
        {blogSources.map((i, index) => (
          <li
            className={`${styles.alt_tabs_item} ${
              currentIndex === index && styles.active
            }`}
            key={index}
            onClick={() => {
              setCurrentIndex(index);
            }}
          >
            Blog {index + 1}{" "}
            {index > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  let tab = [...blogSources];
                  const removed = tab.splice(index, 1);
                  setBlogSources(tab);
                  setCurrentIndex(0);
                }}
              >
                <IconTrash />
              </span>
            )}
          </li>
        ))}
        <li
          className={styles.tab_plus}
          onClick={() => {
            setBlogSources([...blogSources, { search: "", article: null }]);
            setCurrentIndex(blogSources.length);
          }}
        >
          <IconPlus />
        </li>
      </ul>

      {!blogSources[currentIndex]?.article && (
        <div className={styles.tamtamIt}>
          <input
            type="text"
            placeholder="Rechecher par titre ou tag"
            className={styles.textContent}
            value={blogSources[currentIndex].search}
            onChange={handleSearchChange}
          />
          {/* <button className="defaultBtn" onClick={handleTamtamIt}>
          {isParsing ? (
            <span className={styles.spinner}>
              <IconSpinner size="20" />
            </span>
          ) : (
            <IconLink />
          )}
        </button> */}
        </div>
      )}

      <div className={styles.resultContainer}>
        {isFetching ? (
          <div className={styles.spinner}>
            <IconSpinner size="20" />
          </div>
        ) : (
          <div className={styles.results}>
            {isFetched && results?.article?.length === 0 && (
              <div className="results__not-found">
                Votre recherche ne correspond à aucun document.
              </div>
            )}

            {blogSources[currentIndex]?.article ? (
              <div className={`${styles.itemResult} ${styles.active}`}>
                <div>{blogSources[currentIndex].article.title}</div>
                <span
                  className={styles.itemResult_check_icon}
                  onClick={(e) => {
                    const tab = [...blogSources];
                    tab[currentIndex].article = null;
                    setBlogSources(tab);
                    setIsFetched(false);
                  }}
                >
                  <span className={styles.itemResult_check_icon_1}>
                    <IconCheck size={20} />
                  </span>
                  <span className={styles.itemResult_check_icon_2}>
                    <IconClose size={20} />
                  </span>
                </span>
              </div>
            ) : (
              isFetched && (
                <>
                  <h3 className={styles.subtitle}>Articles trouvés :</h3>
                  <div>
                    {results?.article?.map((i) => (
                      <div key={i.id} className={`${styles.itemResult} `}>
                        <div>{i.title}</div>
                        <span
                          className={styles.itemResult_add_icon}
                          onClick={(e) => {
                            const tab = [...blogSources];
                            tab[currentIndex].article = i;
                            tab[currentIndex].search = "";
                            setBlogSources(tab);
                            setResults({});
                          }}
                        >
                          <IconPlus size={20} />
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSource;
