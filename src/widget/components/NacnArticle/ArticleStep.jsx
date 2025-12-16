import { useEffect, useState } from "react";

import cockpitLogo from "../../../assets/cockpit.svg";
import { tamtamIt, getPrompts, genetateArticle } from "../../api";
import styles from "./NacnArticle.module.scss";
import Checkbox from "../common/Checkbox";
import IconLink from "../../icons/IconLink";
import IconSpinner from "../../icons/IconSpinner";
import IconHashtag from "../../icons/IconHashtag";
import { getDateByLang } from "../../services/utils";
import Loader from "../common/Loader";
import IconEye from "../../icons/IconEye";

const ArticleStep = ({ onPost, setIsOpen, token, apiUrl, aiUrl }) => {
  const [step, setStep] = useState(1);
  const [content, setContent] = useState("");
  const [inputType, setInputType] = useState("TEXT"); // TEXT | LINK
  const [inputValue, setInputValue] = useState("");
  const [linkValue, setLinkValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [isFetchingPrompt, setIsFetchingPrompt] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const handleClick = () => {
    if (onPost) {
      onPost({
        type: "ARTICLE_DATA",
        data: {
          content,
        },
      });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (prompts.length === 0 && step === 1) {
      async function fetchData() {
        setIsFetchingPrompt(true);
        try {
          const response = await getPrompts({
            aiUrl,
            token,
            filters: { blog: true },
          });
          if (response?.items) {
            setPrompts(response.items);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setIsFetchingPrompt(false);
      }

      fetchData();

      // setIsFetchingPrompt(true);
      // setTimeout(() => {
      //   setPrompts([
      //     {
      //       name: "Création nettoyée (non altérée) à partir d'un post Linkedin",
      //       description:
      //         "Ce prompt permet de créer un article à partir d'un post linkedin pour un expert comptable, fiscal ou de droit",
      //       related_products: ["Blog"],
      //       system_prompt:
      //         "Pouvez-vous me rédiger un article qui traite au mieux les sujets traités dans les sources utilisateur ci-dessous avec pour objectif d'en changer le format (de post linkedin à article)?\nCet article intègrera le blog des professions économiques et juridiques (pour les experts et leurs clients)\nCe blog traite des matière comptable, fiscale et de droit.  les termes utilisés doivent relever de ce domaine.",
      //       user_prompt:
      //         "Créez un article à partir du post LinkedIn fourni, en respectant impérativement les consignes suivantes :\n\t•\tConservez intégralement le texte d’origine, sans le modifier ni le reformuler.\n\t•\tAjoutez un titre attrayant qui donne envie de lire, en respectant les règles grammaticales (majuscule uniquement en début de phrase ou pour les noms propres).\n\t•\tSupprimez tous les emojis, y compris ceux utilisés pour les titres ou les listes.\n\t•\tUtilisez le gras pour mettre en valeur les messages ou notions importantes.\n\t•\tMettez en valeur les idées clés avec des balises blockquote lorsque cela s’y prête.\n\t•\tRespectez une présentation professionnelle : structure claire, lisibilité, pas de majuscules superflues dans les titres ni dans le texte.\n\t•\tSoignez la mise en page (titres, paragraphes, gras, blockquotes), pour un rendu adapté à une publication presse/blog.\n\nNe reformulez ni n’altérez le contenu du post.",
      //       response_format: "html",
      //       response_structure: " ",
      //       id: 6,
      //       created_at: "2025-05-31T09:15:24.402000Z",
      //       updated_at: "2025-07-04T15:02:46.433000",
      //     },
      //     {
      //       name: "Création d’un article à partir de sources pour les EC",
      //       description:
      //         "Cet article vise à fournir aux experts-comptables et conseillers fiscaux de Belgique un aperçu clair et synthétique des sujets traités dans les sources sélectionnées. Rédigé dans un ton d’assistance et de soutien, il propose des conseils pratiques, des exemples concrets et un tableau récapitulatif. Il conclut par des recommandations pour aider les professionnels à mieux accompagner leurs clients, tout en intégrant, le cas échéant, des références légales, doctrinales ou jurisprudentielles.",
      //       related_products: ["Blog"],
      //       system_prompt:
      //         "Pouvez-vous me rédiger un article qui traite au mieux les sujets traités dans les sources utilisateur ci-dessous ?\nCet article intègrera le blog de l'Ordre des experts-comptables belge. \nCe blog traite des matière comptable, fiscale et de droit.  les termes utilisés doivent relever de ce domaine.\n\nIl s’agit d’un article destiné aux experts-comptables et conseillers fiscaux de Belgique, pour le blog de l’Ordre des Experts-Comptables (OECCBB).\nLe ton doit être celui de l’assistance et du soutien à nos membres professionnels, en leur fournissant des conseils utiles et des informations claires pour les aider à mieux exercer leur métier de conseil auprès de leurs clients.\nLe ton est aussi davantage celui d'un ton professionnel, académique (séreux) mais abordable à la lecture.\nVous pouvez réfléchir à organiser le texte de façon semblable chaque fois afin de permettre de reconnaitre un style \"OECCBB\", en terminant par exemple par le fait que l'ordre est aux côtés de chaque professionnels pour faire face à ses besoins dans sa pratique professionnelle.",
      //       user_prompt:
      //         "Rédigez une synthèse des publications ci-jointes sous la forme d’un article destiné au blog de l’Ordre des experts-comptables.\nL’article doit s’adresser exclusivement aux experts-comptables et conseillers fiscaux (et non à leurs clients), en privilégiant la rigueur, la pédagogie et l’illustration concrète.\n\nConsignes de fond :\n\t•\tIntroduction : Posez d’emblée l’enjeu professionnel et l’intérêt du sujet, de façon fluide, engageante, et en évitant toute formule du type « Cet article aborde… ».\n\t•\tStructuration : Organisez le texte en paragraphes, chacun développant un aspect distinct, jamais en une phrase unique.\nLes paragraphes peuvent être précédés d’un titre sous forme de question (FAQ), si cela facilite la lecture et la compréhension.\n\t•\tDéveloppement : Chaque point doit être traité en profondeur, sans énumération expéditive ; les listes sont permises mais toujours accompagnées d’explications suffisantes.\n\t•\tExemples : Illustrez les points clés avec des cas pratiques ou exemples concrets pertinents pour la profession.\n\t•\tTableaux : Ajoutez en fin d’article un tableau de synthèse riche, structuré sur plusieurs dimensions, reprenant l’essentiel du contenu et permettant une lecture rapide et efficace.\nLes textes dans les tableaux respectent les règles grammaticales (majuscules uniquement en début de phrase).\n\t•\tConclusion : Terminez par une conclusion synthétique, rappelant les enjeux, problématiques et recommandations à l’attention de nos membres.\n\t•\tCitations : Ne citez que les sources légales, doctrinales ou jurisprudentielles directement utiles à l’analyse (pas de citations générales ou superflues).\nPlacez ces références en fin d’article.\n\nConsignes de forme :\n\t•\tTitres : Pas de majuscules systématiques, respect strict des règles grammaticales (majuscules en début de phrase uniquement).\n\t•\tClarté et lisibilité : Privilégiez un style clair, académique et structurant. Évitez les phrases trop longues ou trop complexes.\n\t•\tHTML : Structurez l’article en HTML propre et lisible (titres, sous-titres, gras pour les idées maîtresses, blocs de citation pour les points clés ou quotes).\n\t•\tMise en valeur : Utilisez le gras ou d’autres mécanismes (blockquote, balisage approprié) pour mettre en valeur les messages essentiels.\n\nNe modifiez pas le fond des sources, mais reformulez pour garantir un style original, pédagogique et adapté à notre lectorat professionnel.",
      //       response_format: "html",
      //       response_structure: " ",
      //       id: 4,
      //       created_at: "2025-05-30T15:31:31.420000Z",
      //       updated_at: "2025-07-04T15:00:54.280000",
      //     },
      //     {
      //       name: "Création d'un édito pour l'OECCBB",
      //       description:
      //         "Ce prompt permet de réaliser plus facilement un edito pour l'Ordre des experts-comptables",
      //       related_products: ["Blog"],
      //       system_prompt:
      //         "L'ordre des experts-comptables est aussi appelé OECCBB pour Ordre des experts-comptables et comptables brevetés de Belgique.\nIl s'agit de l'association historique de l'expertise-comptable en Belgique, crée en 1959.\nLes éditos de l'OECCBB sont réalisé toutes les semaines.\nIls sont en tête d'une newsletter envoyée chaque vendredi.\nUn édito de l'OECCBB revient sur une actualité, une activité ou un thème chers aux experts-comptables.\nLa newsletter est envoyée aux membres, mais aussi aux anciens ou futurs membres dans un but de les assembler et de les ramener, lorsque c'est pertinent, comme membre.\nL'édito est généralement signé par le président (mais pas toujours) qui est Emmanuel Degrève.",
      //       user_prompt:
      //         "Rédigez un édito (carte blanche) pour la newsletter et le blog de l’Ordre des experts-comptables, à destination exclusive des experts-comptables et conseillers fiscaux.\nAdoptez un ton engagé, fédérateur et mobilisateur, incarnant la voix d’une association professionnelle vigilante et militante.\n\nConsignes de fond :\n\t•\tIntroduction : Entrez immédiatement dans le vif du sujet, en posant l’enjeu professionnel et l’intérêt de la chronique de façon fluide et captivante, sans formules du type « Cet article aborde… ».\n\t•\tDéveloppement : Structurez l’article en paragraphes consistants, chacun développant un point distinct (jamais de phrases uniques).\n\t•\tConclusion : Terminez par une conclusion synthétique rappelant les enjeux, problématiques et recommandations à l’attention des membres de l’Ordre.\n\t•\tCitations : Ne citez que les sources légales, doctrinales ou jurisprudentielles directement utiles (jamais de citation générale ou décorative).\n\nConsignes de forme :\n\t•\tTitres : Pas de majuscules superflues, respect strict des règles grammaticales.\n\t•\tClarté et lisibilité : Privilégiez un style engagé, représentatif de la profession, clair et structuré.\n\t•\tStructure : Mettez en page l’article avec des titres, sous-titres, gras pour les idées maîtresses et blockquotes pour valoriser les messages clés ou citations marquantes.\n\t•\tMise en valeur : Utilisez le gras, blockquotes ou autres balises appropriées pour souligner les messages essentiels ; ce point est crucial pour renforcer la dimension professionnelle.\n\t•\tUniformité : Maintenez une présentation constante sur l’ensemble du texte.\n\nNe modifiez pas le fond des idées, mais reformulez pour garantir un style original, mobilisateur et adapté au lectorat professionnel de l’Ordre.",
      //       response_format: "html",
      //       response_structure: " ",
      //       id: 7,
      //       created_at: "2025-05-31T09:58:17.301000Z",
      //       updated_at: "2025-07-02T16:19:47.113000",
      //     },
      //     {
      //       name: "Création d'une carte blanche pour Emmanuel Degrève",
      //       description:
      //         "Ce prompt permet de faciliter la rédaction d'une carte blanche à partir de la fomulation d'un ensemble d'idées structurée par l'auteur",
      //       related_products: ["Blog"],
      //       system_prompt:
      //         "Pouvez-vous réaliser une chronique signé par Emmanuel Degrève fiscaliste, économiste, président de l'Ordre des experts-comptable et du Forum For the Future.  Il est aussi founding partner du cabinet Deg & Partners, un cabinet en belle évolution sur le marché francophone de la fiduciaire (cabinet d'expertise-comptbale et fiscale).  Il est aussi chargé de conférences à la Solvay Business school en \"green taxation\".\nIl publie régulièrement sur des sujets d'économie lié à la fiscalité, la durabilité, la bonne gouvernance ou sur des thématique qui touchent directemenet ou indirectement les professions économiques et juridiques (experts-comptables, conseillers fiscaux, réviseurs d'entreprise, fiscalistes, avocats, notaires, juristes, directeurs financiers, banquiers,…)\nCette chronique doit traiter l'idée fournie sur un ton de chronique.  Les arguments doivent doivent être bien compris, le style journalistique, rythmé et permettant de soutenir l'attention.\nLa chronique doit avoir une taille pour être intégrée dans la presse quotidienne.  cette taille s'exprime en signe : 4500 signes.",
      //       user_prompt:
      //         "Rédigez une carte blanche signée Emmanuel Degrève, adoptant un ton engagé, structuré, argumenté et rythmé.\nLe texte final doit comporter au minimum 4 500 caractères (espaces compris) : il ne peut pas être trop court.\n\nConsignes de fond :\n\t•\tIntroduction : Posez immédiatement l’enjeu de la chronique et la façon dont le texte va décoder la thématique, de façon fluide et engageante (évitez toute formule du type « Cet article aborde… »).\n\t•\tDéveloppement : Structurez le texte en paragraphes consistants, chacun approfondissant un point distinct ou un angle du sujet, afin de garantir la densité et la richesse du propos.\n\t•\tConclusion : Clôturez par une conclusion synthétique, rappelant les principaux enjeux, problématiques et recommandations pour le lecteur.\n\nConsignes de forme :\n\t•\tLongueur : Rédigez un texte d’au moins 4 500 caractères (espaces compris), sans jamais être en dessous de ce seuil.\n\t•\tTitres : Utilisez des titres et sous-titres sans majuscules superflues (respect des règles grammaticales).\n\t•\tClarté et lisibilité : Privilégiez un style engagé, rythmé, favorisant la lecture jusqu’au bout.\n\t•\tStructure et mise en valeur : Intégrez titres, sous-titres, mettez en gras les idées maîtresses, et utilisez les blockquotes pour mettre en valeur les citations ou messages clés.\n\t•\tUniformité : Veillez à une présentation homogène et professionnelle du début à la fin.\n\nN’altérez pas le fond des idées, mais reformulez pour garantir un style original, mobilisateur et structuré, conforme à une carte blanche signée Emmanuel Degrève.",
      //       response_format: "html",
      //       response_structure: " ",
      //       id: 8,
      //       created_at: "2025-05-31T10:40:52.170000Z",
      //       updated_at: "2025-06-20T12:27:58.379000Z",
      //     },
      //     {
      //       name: "Création d’un article à partir de sources pour les clients",
      //       description:
      //         "Cet article vise à fournir aux clients des experts-comptables et conseillers fiscaux de Belgique un aperçu clair et synthétique des sujets traités dans les sources sélectionnées.",
      //       related_products: ["Blog"],
      //       system_prompt:
      //         "Pouvez-vous me rédiger un article qui traite au mieux les sujets traités dans les sources utilisateur ci-dessous ?\nCet article intègrera le blog d'une fiduciaire (bureau d'expertise-comptable et fiscale)\nCe blog traite des matière comptable, fiscale et de droit.  les termes utilisés doivent relever de ce domaine.\n\nIl s’agit d’un article destiné aux clients du cabinet.\nLe ton doit être celui de la pédagogie et de l'explication.",
      //       user_prompt:
      //         "Rédigez une synthèse des publications jointes sous la forme d’un article destiné au blog d’une fiduciaire, à l’intention de ses clients.\nL’article doit être pédagogique, professionnel et richement illustré d’exemples concrets.\n\nConsignes de fond :\n\t•\tIntroduction : Posez immédiatement l’enjeu et l’intérêt du sujet, de manière fluide et engageante, sans formules du type « Cet article aborde… ».\n\t•\tStructuration : Organisez l’article en paragraphes généreusement développés, chacun couvrant un aspect distinct (pas de phrases isolées).\nLes paragraphes peuvent être précédés d’un titre interrogatif (sans mentionner « FAQ ») pour faciliter la lecture.\nLa structure doit se démarquer de celle des sources et servir la pédagogie.\n\t•\tDéveloppement : Traitez chaque point en profondeur ; listes autorisées si elles sont accompagnées d’explications claires et détaillées.\n\t•\tExemples : Illustrez chaque point clé par des cas pratiques ou exemples concrets adaptés au lectorat client. Si utile, consacrez un paragraphe complet à un exemple.\n\t•\tTableau : En fin d’article, insérez un tableau de synthèse à plusieurs dimensions, fidèle au contenu de l’article, pour une lecture rapide.\nLes textes dans les tableaux respectent les règles grammaticales (majuscules en début de phrase uniquement).\n\t•\tRecommandations : Ajoutez un paragraphe de recommandations concrètes à destination des clients.\n\t•\tConclusion : Résumez les enjeux, la problématique et les recommandations de manière synthétique et accessible.\n\t•\tCitations : Citez uniquement les sources légales, doctrinales ou jurisprudentielles issues des textes soumis, en fin d’article (liste, pas de citation générale ni superflue).\n\nConsignes de forme :\n\t•\tTitres : Pas de majuscules superflues, respect strict des règles grammaticales.\n\t•\tClarté : Adoptez un style clair, structurant et académique, sans phrases trop longues ni complexes.\n\t•\tHTML : Structurez en HTML soigné : titres, sous-titres, gras pour les idées maîtresses, balises blockquote pour les points clés/quotes.\n\t•\tMise en valeur : Utilisez le gras et les balises appropriées pour valoriser les messages importants, afin de renforcer la qualité professionnelle.\n    •. Utilisez les blockquotes pour mettre une idée clé en valeur lorsque c'est nécessaire.\n\t•\tCohérence : Maintenez une présentation homogène sur l’ensemble de l’article.\n\nNe modifiez pas le fond des sources, mais reformulez pour garantir un style original, pédagogique et parfaitement adapté à un public de clients de cabinet.",
      //       response_format: "html",
      //       response_structure: " ",
      //       id: 5,
      //       created_at: "2025-05-30T17:12:45.086000Z",
      //       updated_at: "2025-05-31T09:14:39.661000Z",
      //     },
      //   ]);
      //   setIsFetchingPrompt(false);
      // }, 2000);
    }
  }, [step]);

  const handleTamtamIt = () => {
    setIsParsing(true);
    let url = linkValue;
    let urlHasProtocolHttp = url.toLowerCase().startsWith("http");
    if (!urlHasProtocolHttp) {
      url = "http://" + url;
    }
    tamtamIt(apiUrl, token, url)
      .then((resp) => {
        if (resp.data.data) {
          let { provided_url, url_information } = resp.data.data;
          if (url_information.description) {
            let txt = "";
            if (url_information.title) {
              txt += url_information.title + "\n";
            }
            txt += url_information.description;
            setInputValue(txt);
          }
        }
      })
      .finally(() => setIsParsing(false));
  };

  const handleGenerateText = async () => {
    if (inputValue.length > 0 && selectedPrompt) {
      setIsFetching(true);
      const articleContent = await genetateArticle({
        aiUrl,
        token,
        content: inputValue,
        promptId: selectedPrompt.id,
      });
      console.log(articleContent);
      if (articleContent?.data?.answer) {
        setContent(articleContent.data.answer);
      }
      setStep(2);
      setIsFetching(false);

      // setTimeout(() => {
      //   setContent("<h3>Test contenu</h3>");
      //   setStep(2);
      //   setIsFetching(false);
      // }, 1000);
    }
  };

  return (
    <>
      <h2 className={styles.title}>
        <img src={cockpitLogo} alt="NACN AI" width={30} />
        Création d’un article
      </h2>

      <div className={styles.articleContainer}>
        <>
          {step === 1 && (
            <>
              <div className={styles.box}>
                <div className={styles.box_left}>
                  <h3>Sélectionnez la source de l’article :</h3>

                  <ul className={styles.articleList}>
                    <li
                      className={
                        inputType === "TEXT" && styles.articleList_active
                      }
                      onClick={(e) => {
                        setInputValue("");
                        setInputType("TEXT");
                      }}
                    >
                      <Checkbox checked={inputType === "TEXT"} radio={true} />
                      Texte manuel
                    </li>

                    <li
                      className={
                        inputType === "LINK" && styles.articleList_active
                      }
                      onClick={(e) => {
                        setInputValue("");
                        setInputType("LINK");
                      }}
                    >
                      <Checkbox checked={inputType === "LINK"} radio={true} />
                      Lien web
                    </li>
                  </ul>
                  {inputType === "TEXT" ? (
                    <textarea
                      className={`${styles.textContent} ${styles.textarea}`}
                      rows="10"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    ></textarea>
                  ) : inputType === "LINK" ? (
                    <>
                      <div className={styles.tamtamIt}>
                        <input
                          type="text"
                          className={styles.textContent}
                          value={linkValue}
                          onChange={(e) => setLinkValue(e.target.value)}
                        />
                        <button className="defaultBtn" onClick={handleTamtamIt}>
                          {isParsing ? (
                            <span className={styles.spinner}>
                              <IconSpinner size="20" />
                            </span>
                          ) : (
                            <IconLink />
                          )}
                        </button>
                      </div>
                      <textarea
                        className={`${styles.textContent} ${styles.textarea}`}
                        rows="10"
                        disabled
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      ></textarea>
                    </>
                  ) : null}
                </div>

                <div className={styles.box_right}>
                  <h3>Choisissez un prompt :</h3>
                  {isFetchingPrompt && (
                    <div className={styles.loader}>
                      <Loader
                        style={{
                          height: "12px",
                        }}
                        color={"#6D7F92"}
                      />
                    </div>
                  )}

                  <ul className={styles.prompts}>
                    {prompts.map((i) => (
                      <li
                        className={`${styles.prompt} ${
                          selectedPrompt?.id === i.id && styles.prompt_active
                        }`}
                        key={`prom${i.id}`}
                        onClick={() => {
                          if (selectedPrompt?.id !== i.id) {
                            setSelectedPrompt(i);
                          } else {
                            setSelectedPrompt(null);
                          }
                        }}
                      >
                        <h4>
                          <IconHashtag /> {i.name}
                        </h4>
                        <p className={styles.date}>
                          {getDateByLang(i.created_at, "fr", true)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.actions}>
                {isFetching ? (
                  <button
                    className="gradientBtn"
                    style={{
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    }}
                    disabled
                  >
                    <Loader
                      style={{
                        height: "10px",
                      }}
                      color={"#fff"}
                    />
                  </button>
                ) : (
                  <button
                    className="gradientBtn"
                    onClick={handleGenerateText}
                    disabled={!selectedPrompt || inputValue.length === 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <path
                        d="M13.3327 1.83363V4.50029M14.666 3.16696H11.9993M7.34398 2.37629C7.37255 2.22336 7.4537 2.08524 7.57338 1.98584C7.69307 1.88644 7.84374 1.83203 7.99932 1.83203C8.15489 1.83203 8.30557 1.88644 8.42525 1.98584C8.54494 2.08524 8.62609 2.22336 8.65465 2.37629L9.35532 6.08163C9.40508 6.34506 9.5331 6.58737 9.72267 6.77694C9.91224 6.96651 10.1546 7.09453 10.418 7.14429L14.1233 7.84496C14.2762 7.87353 14.4144 7.95468 14.5138 8.07436C14.6132 8.19404 14.6676 8.34472 14.6676 8.50029C14.6676 8.65587 14.6132 8.80655 14.5138 8.92623C14.4144 9.04591 14.2762 9.12706 14.1233 9.15563L10.418 9.85629C10.1546 9.90606 9.91224 10.0341 9.72267 10.2236C9.5331 10.4132 9.40508 10.6555 9.35532 10.919L8.65465 14.6243C8.62609 14.7772 8.54494 14.9154 8.42525 15.0147C8.30557 15.1141 8.15489 15.1686 7.99932 15.1686C7.84374 15.1686 7.69307 15.1141 7.57338 15.0147C7.4537 14.9154 7.37255 14.7772 7.34398 14.6243L6.64332 10.919C6.59355 10.6555 6.46553 10.4132 6.27596 10.2236C6.0864 10.0341 5.84408 9.90606 5.58065 9.85629L1.87532 9.15563C1.72239 9.12706 1.58426 9.04591 1.48486 8.92623C1.38547 8.80655 1.33105 8.65587 1.33105 8.50029C1.33105 8.34472 1.38547 8.19404 1.48486 8.07436C1.58426 7.95468 1.72239 7.87353 1.87532 7.84496L5.58065 7.14429C5.84408 7.09453 6.0864 6.96651 6.27596 6.77694C6.46553 6.58737 6.59355 6.34506 6.64332 6.08163L7.34398 2.37629ZM3.99932 13.8336C3.99932 14.57 3.40236 15.167 2.66598 15.167C1.9296 15.167 1.33265 14.57 1.33265 13.8336C1.33265 13.0972 1.9296 12.5003 2.66598 12.5003C3.40236 12.5003 3.99932 13.0972 3.99932 13.8336Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>{" "}
                    Générer l'article
                  </button>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className={styles.topBar}>
                <div>
                  <span>Article:</span> version 1
                </div>
                <div className={styles.topBar_right}>
                  Source:{" "}
                  {inputType === "TEXT"
                    ? "Texte manuel"
                    : inputType === "LINK"
                    ? "Lien"
                    : ""}
                  <span></span>
                  <div className={styles.triggerContainer}>
                    <span className={styles.triggerElement}>
                      <IconEye size="18" />
                    </span>
                    <div className={styles.popoverContent}>{inputValue}</div>
                  </div>
                </div>
              </div>

              <p
                className={styles.textPreview}
                dangerouslySetInnerHTML={{ __html: content }}
              />

              <div className={styles.actions}>
                <button className="primaryBtn" onClick={handleClick}>
                  Utiliser cette version
                </button>
              </div>
            </>
          )}
        </>
      </div>
    </>
  );
};

export default ArticleStep;
