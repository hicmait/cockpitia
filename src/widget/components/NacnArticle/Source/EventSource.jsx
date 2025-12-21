import { useState } from "react";
import debounce from "lodash.debounce";
import moment from "moment-timezone";

import { getEvents } from "../../../api";
import { formatDateFromTo, isEmpty } from "../../../services/utils";
import styles from "../NacnArticle.module.scss";
import IconCalendar from "../../../icons/IconCalendar";
import IconSpinner from "../../../icons/IconSpinner";
import IconPlus from "../../../icons/IconPlus";
import IconTrash from "../../../icons/IconTrash";
import IconCheck from "../../../icons/IconCheck";
import IconClose from "../../../icons/IconClose";

let I18N = {
  nl: {
    inReplay: "In Replay",
    liveNow: "live now",
    inProgress: "In progress now",
    seen: "Already Seen",
    presential: "On the spot",
    hybrid: "Hybrid",
    inLive: "In live",
    dateFrom: "from",
    dateFrom2: "from",
    timeTo: "to",
    dateTo: "to",
  },
  fr: {
    inReplay: "En Replay",
    liveNow: "en live maintenant",
    inProgress: "En cours maintenant",
    seen: "Déja Vu",
    presential: "En Présentiel",
    hybrid: "Hybride",
    inLive: "En live",
    dateFrom: "de",
    dateFrom2: "du",
    timeTo: "à",
    dateTo: "au",
  },
};

const PAGE_SIZE = 8;

const EventSource = ({
  token,
  apiUrl,
  organizationId,
  lng,
  eventSources,
  setEventSources,
  currentIndex,
  setCurrentIndex,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  const nameAttr = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;

  const debouncedSearchLoadResults = debounce((search) => {
    const queryParams = {
      access_token: token,
      languages: lng,
      search,
      tags: "",
      cities: "",
      communityIds: [organizationId],
      start: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    };

    setIsFetching(true);
    getEvents(apiUrl, queryParams)
      .then((resp) => {
        setResults(resp.data.data);
        setIsFetching(false);
        setIsFetched(true);
      })
      .catch((e) => {
        if (!e?.response?.status === 700) {
          setIsFetching(false);
          setResults([]);
        }
      });
  }, 1000);

  const handleSearchChange = (e) => {
    const tab = [...eventSources];
    tab[currentIndex].search = e.target.value;
    setEventSources(tab);

    if (e.target.value.length > 2) {
      debouncedSearchLoadResults(e.target.value);
    } else {
      setResults([]);
      setIsFetched(false);
    }
  };

  const getInfos = (event, language) => {
    const modeLabel = {
      VIRTUAL: I18N[language]["inLive"],
      PRESENTIAL: I18N[language]["presential"],
      HYBRID: I18N[language]["hybrid"],
    };

    const { isReplayable, isVirtual, startDateTime, endDateTime } = event;

    const name = getByLanguage(event, "name", language);
    const label = getByLanguage(event, "label", language, true);
    const city = getByLanguage(event.eventPlace?.city, "city", language);
    const mode = getEventMode(event);

    const isPast = isEventPast(event);
    const isLive = isEventLive(event);

    const dateHelper = formatDateFromTo(
      startDateTime ?? "",
      endDateTime ?? "",
      I18N,
      language
    );

    const endOfReplay = dateEndOfReplay
      ? moment(dateEndOfReplay)
      : moment.max(moment(endDateTime), moment()).add(REPLAY_UPTIME, "months");
    const endOfReplayYear = endOfReplay.format("YYYY");

    const isReplayExpired = moment().isAfter(endOfReplay);

    return (
      <ul>
        {!isPast && (
          <li>
            <IconCalendar />
            <span>
              <strong>{modeLabel[mode]} :&nbsp;</strong>
              {dateHelper}
            </span>
          </li>
        )}
        {/* {!isEmpty(city) && !isVirtual && !isPast && (
              <li>
                <Presential2Icon />
                <span>{city}</span>
              </li>
            )} */}
        {/* {
              isPast && isReplayable && isVirtual && !isReplayExpired
            && (
              <li>
                <Replay2Icon />
                <span>
                  <strong>{I18N[language]["inReplay"]}</strong>
                  <div className={styles.year}>{endOfReplayYear}</div>
                </span>
              </li>
            )} */}
      </ul>
    );
  };

  return (
    <div>
      <ul className={styles.alt_tabs}>
        {eventSources.map((i, index) => (
          <li
            className={`${styles.alt_tabs_item} ${
              currentIndex === index && styles.active
            }`}
            key={index}
            onClick={() => {
              setCurrentIndex(index);
            }}
          >
            Event {index + 1}{" "}
            {index > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  let tab = [...eventSources];
                  const removed = tab.splice(index, 1);
                  setEventSources(tab);
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
            setEventSources([...eventSources, { search: "", event: null }]);
            setCurrentIndex(eventSources.length);
          }}
        >
          <IconPlus />
        </li>
      </ul>

      {!eventSources[currentIndex]?.event && (
        <div className={styles.tamtamIt}>
          <input
            type="text"
            placeholder="Rechecher par titre"
            className={styles.textContent}
            value={eventSources[currentIndex].search}
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
            {isFetched && results?.length === 0 && (
              <div className="results__not-found">
                Votre recherche ne correspond à aucun document.
              </div>
            )}

            {eventSources[currentIndex]?.event ? (
              <div className={`${styles.itemResult} ${styles.active}`}>
                <div>{eventSources[currentIndex].event[nameAttr]}</div>
                <span
                  className={styles.itemResult_check_icon}
                  onClick={(e) => {
                    const tab = [...eventSources];
                    tab[currentIndex].event = null;
                    setEventSources(tab);
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
                  <h3 className={styles.subtitle}>Events trouvés :</h3>
                  <div>
                    {results?.map((i) => (
                      <div
                        key={`event${i.id}`}
                        className={`${styles.itemResult} `}
                      >
                        <div>
                          <p>{i[nameAttr]}</p>
                          {/* {getInfos(i, lng)} */}
                        </div>
                        <span
                          className={styles.itemResult_add_icon}
                          onClick={(e) => {
                            const tab = [...eventSources];
                            tab[currentIndex].event = i;
                            tab[currentIndex].search = "";
                            setEventSources(tab);
                            setResults([]);
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

export default EventSource;
