import { useState } from "react";
import debounce from "lodash.debounce";

import { getEvents } from "../../../api";
import styles from "../NacnArticle.module.scss";
import IconLink from "../../../icons/IconLink";
import IconSpinner from "../../../icons/IconSpinner";
import IconPlus from "../../../icons/IconPlus";
import IconTrash from "../../../icons/IconTrash";
import IconCheck from "../../../icons/IconCheck";
import IconClose from "../../../icons/IconClose";

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
      .catch(() => {
        setIsFetching(false);
        setResults([]);
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
                        <div>{i[nameAttr]}</div>
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
