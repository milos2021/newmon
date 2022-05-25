<template>
  <div class="container-fluid">
        <div class="loader-container" ref="loadingBar" id="loadingBar">
                 <span class="matchData">Podaci o mečevima se učitavaju</span>

     <div class="loader" >
       
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
    </div>
    <div class="row sports">
      <div class="col-md-1 logo"><img src="../assets/soccerLogo.png" /></div>
      <div
        v-html="sport"
        v-bind:class="{
          'col-md-1': true,
          sportsList: true,
          firstSportsList: true,
          fudbal: index == 0,
        }"
        v-for="(sport, index) in sports"
        :key="sport"
      ></div>
      <span class="matchCount">{{ countPovezani }}</span>
      <div class="col-md-1 sportsList secondSportsList">
        <img src="../assets/clock.png" alt="Loader" width="23px" />
      </div>
      <div class="col-md-1 sportsList thirdSportsList">
        <span
          >{{ new Date().getDate() }}. {{ months[new Date().getMonth()] }},
          {{ days[new Date().getDay()] }}
        </span>
        <br />
        <span>{{ lastReloadTime }}</span>
      </div>
      <div class="col-md-1 reload">
        <circular-count-down-timer
          v-if="reloadActive"
          :initial-value="30"
          :stroke-width="3"
          :seconds-stroke-color="'red'"
          :underneath-stroke-color="getColorAccordingToStyle()"
          :seconds-fill-color="'rgba(255,255,255,0.7)'"
          :size="70"
          :steps="1"
          :padding="5"
          :show-second="true"
          :notify-every="'minute'"
          @finish="finished"
        ></circular-count-down-timer>
        <div
          class="col-md-1 sportsList spinner"
          id="miniLoadingBar"
          v-if="!reloadActive && !initial"
        >
          <img src="../assets/loader.gif" alt="Loader" width="50" />
          <!-- <i class="fas fa-angle-double-right"></i> -->
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 side" id="left">
        <div class="row">
          <div class="col-md-3">
            <div class="multiselect" v-click-outside="hideCheckboxes">
              <div class="selectBox" v-on:click="showCheckboxes()">
                <select class="form-control ligaSelect">
                  <option class="wht">Izaberi ligu...</option>
                </select>
                <div class="overSelect"></div>
              </div>
              <div id="checkboxes">
                <label v-for="liga in leagues.data" :key="liga" :for="liga">
                  <input
                    v-on:click="filterLiga($event)"
                    type="checkbox"
                    :id="liga"
                  />{{ liga }}
                </label>
              </div>
            </div>
            <span
              ><v-checkbox
                class="all--liga"
                :ripple="false"
                v-model="allLiga"
                v-on:change="toggleLiga($event)"
              ></v-checkbox
            ></span>

            <!-- <select
         
            >
              <option v-for="item in lige" :key="item" :value="item">
                {{ item }}
              </option>
            </select> -->
          </div>

          <div class="col-md-3">
            <input
              type="text"
              class="form-control"
              v-on:keyup="teamSearch"
              v-model="searchTerms.team"
              style="background-color: rgba(0, 0, 0, 0.5); color: white"
              placeholder="Unesi naziv tima ili lige..."
            />
          </div>
          <div class="col-md-3">
            <select
              class="form-control sort"
              @change="teamRangeChange($event)"
              v-model="defaultValues.range"
            >
              <option value="0">Svi mečevi</option>
              <option value="1">Naredna 3h</option>
              <option value="2">Danas</option>
              <option value="3">Naredna 3 dana</option>
              <!-- <option value="4">KI Payout</option>
  <option value="5">UG Payout</option> -->
            </select>
            <!-- <a v-if="hiddenMatches.length > 0" href="#sakriveni"
              ><i class="fa fa-2x fa-eye-slash sakriveni"></i></a
            ><span v-if="hiddenMatches.length > 0" class="numberOfHidden"
              >({{ hiddenMatches.length }})</span
            > -->
          </div>
          <div class="col-md-3">
            <select
              class="form-control sort"
              @change="onSortChange($event)"
              v-model="defaultValues.sort"
            >
              <option value="1">Zarada</option>
              <option value="4">Rizik</option>
              <option value="2">Početak ↑</option>
              <option value="3">Početak ↓</option>
              <!-- <option value="4">KI Payout</option>
  <option value="5">UG Payout</option> -->
            </select>
          </div>
        </div>
        <div class="row basicOddsHeader">
          <div class="col-md-8">
            <div class="row">
              <div class="col-md-2 basicOdds">Start</div>
              <div class="col-md-3 col-md-3-half basicOdds">Match</div>
              <div
                class="col-md-2 col-md-1-half basicOdds"
                v-for="odd in basicOdds.football1x2"
                :key="odd"
              >
                {{ odd }}
              </div>
              <div class="col-md-1 basicOdds">%</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="row">
              <div
                class="col-md-4 basicOddsGoals"
                v-for="odd in basicOdds.footballGoals"
                :key="odd"
              >
                {{ odd }}
              </div>
              <div class="col-md-2 basicOddsGoals">%</div>
              <div class="col-md-2 basicOddsGoals">😞</div>
            </div>
          </div>
        </div>
        <!-- odje sam -->
        <VueAutoVirtualScrollList
          :totalHeight="1104"
          :defaultHeight="92"
          style="width: 100%"
          class="pera"
          v-if="data.primary.length > 0"
        >
          <div
            @contextmenu.prevent="$refs.menu.open($event, { item: item })"
            v-on:click="highlightMatch(item.Code)"
            v-bind:class="{
              row: true,
              mec: true,
              highlight: highlightedMatch == item.Code,
            }"
            v-for="item in data.primary"
            :key="item.Code"
          >
            <!-- <div class="col-md-1 level">
            {{ item.level_betradar.toFixed(2) }}<br />
            {{ item.level_asian.toFixed(2) }}
          </div> -->
            <div
              class="col-md-8 teamNamesHolder"
              v-bind:style="[checkColor(item.level_betradar)]"
            >
              <div class="row">
                <div class="col-md-2 league-and-date">
                  <b v-html="formatMatchDate(item.startDate)"> </b>
                  <br />
                  <span class="kr">{{
                    days[new Date(item.startDate).getDay()]
                  }}</span
                  ><br />
                  <b
                    >{{ new Date(item.startDate).getHours() }}:{{
                      new Date(item.startDate).getMinutes().toString().length ==
                      1
                        ? "0" + new Date(item.startDate).getMinutes()
                        : new Date(item.startDate).getMinutes()
                    }}</b
                  >
                </div>
                <div class="col-md-3 col-md-3-half team-names">
                  <a
                    class="teamLinks teamLiga"
                    :title="item.liga"
                    v-on:click.stop="
                      openUrl(
                        'http://10.0.90.252:81/index.php/utakmica/kvoteExpress/action?server=1&liga=' +
                          item.liga,
                        'child'
                      )
                    "
                    ><img
                      src="../assets/rezalica.png"
                      class="mainTeamLinks"
                      width="10" />&nbsp;&nbsp;{{ item.liga }}<br
                  /></a>
                  <a
                    class="teamLinks teamName"
                    :title="item.homeCompetitorName"
                    v-on:click.stop="
                      openUrl(
                        'https://www.oddsportal.com/search/' +
                          item.homeCompetitorName,
                        'child2'
                      )
                    "
                    ><b>{{ item.homeCompetitorName }}</b></a
                  ><br />
                  <a
                    class="teamLinks teamName"
                    :title="item.awayCompetitorName"
                    v-on:click.stop="
                      openUrl(
                        'https://www.oddsportal.com/search/' +
                          item.awayCompetitorName,
                        'child2'
                      )
                    "
                    ><b>{{ item.awayCompetitorName }}</b></a
                  >
                </div>
                <div class="col-md-2 col-md-1-half alignRows">
                  <div class="row">
                    <div
                      v-bind:class="{
                        'col-md-12': true,
                        prod: true,
                        pulse:
                          avoidNull(item.odds['KI 1']['betradar_difference']) < 0,
                      }"
                      v-bind:style="[
                        avoidNull(item.odds['KI 1']['betradar_difference']) < 0
                          ? {
                              color: getDangerColor(),
                              backgroundColor: getDangerBgColor(),
                            }
                          : { color: getColorAccordingToStyle() },
                      ]"
                    >
                      {{
                        avoidNullAndConvertToFixed(item.odds["KI 1"].production)
                      }}
                    </div>
                    <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI 1"].betradar_difference, true, false)}}
                  </div> -->
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(item.odds["KI 1"].betradar)
                      }}
                    </div>
                    <div class="col-md-6 feed">
                      <!-- {{ avoidNullAndConvertToFixed(item.odds["KI 1"].asian) }} -->/
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(
                          getOddForSelectedPayout(item, "KI 1", "1x2")
                        )
                      }}
                    </div>
                    <div class="col-md-3">&nbsp;</div>
                  </div>
                </div>
                <div class="col-md-2 col-md-1-half alignRows">
                  <div class="row">
                    <div
                      class="col-md-12 prod"
                      v-bind:style="[
                        avoidNull(item.odds['KI X']['betradar_difference']) < 0
                          ? {
                              color: getDangerColor(),
                              backgroundColor: getDangerBgColor(),
                            }
                          : { color: getColorAccordingToStyle() },
                      ]"
                    >
                      {{
                        avoidNullAndConvertToFixed(item.odds["KI X"].production)
                      }}
                    </div>
                    <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI X"].betradar_difference, true, false)}}
                  </div> -->
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(item.odds["KI X"].betradar)
                      }}
                    </div>
                    <div class="col-md-6 feed">
                      <!-- {{ avoidNullAndConvertToFixed(item.odds["KI X"].asian) }} -->/
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(
                          getOddForSelectedPayout(item, "KI X", "1x2")
                        )
                      }}
                    </div>
                    <div class="col-md-3">&nbsp;</div>
                  </div>
                </div>
                <div class="col-md-2 col-md-1-half alignRows">
                  <div class="row">
                    <div
                      class="col-md-12 prod"
                      v-bind:style="[
                        avoidNull(item.odds['KI 2']['betradar_difference']) < 0
                          ? {
                              color: getDangerColor(),
                              backgroundColor: getDangerBgColor(),
                            }
                          : { color: getColorAccordingToStyle() },
                      ]"
                    >
                      {{
                        avoidNullAndConvertToFixed(item.odds["KI 2"].production)
                      }}
                    </div>
                    <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI 2"].betradar_difference, true, false)}}
                  </div> -->
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(item.odds["KI 2"].betradar)
                      }}
                    </div>
                    <div class="col-md-6 feed">
                      <!-- {{ avoidNullAndConvertToFixed(item.odds["KI 2"].asian) }} -->/
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(
                          getOddForSelectedPayout(item, "KI 2", "1x2")
                        )
                      }}
                    </div>
                    <div class="col-md-6">&nbsp;</div>
                  </div>
                </div>
                <div class="col-md-1 bela negmar">
                  <div class="row">
                    <div class="col-md-12">
                      {{ calculatePayout(item.odds, "1x2") }}
                    </div>
                  </div>
                  <div class="row mtop25">
                    <div class="col-md-12">
                      <select
                        class="suggestionsList"
                        v-model="item.closest1x2Payout"
                        @click.stop="onGoalsPayoutChange($event, item)"
                      >
                        <option value="98">98%</option>
                        <option value="96">96%</option>
                        <option value="94">94%</option>
                        <option value="92">92%</option>
                        <option value="90">90%</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="row basicOddsDataLeft">
                <div class="col-md-4 alignRows">
                  <div class="row">
                    <div
                      class="col-md-12 prod"
                      v-bind:style="[
                        avoidNull(item.odds['UG 0-2']['betradar_difference']) <
                        0
                          ? {
                              color: getDangerColor(),
                              backgroundColor: getDangerBgColor(),
                            }
                          : { color: getColorAccordingToStyle() },
                      ]"
                    >
                      {{
                        avoidNullAndConvertToFixed(
                          item.odds["UG 0-2"].production
                        )
                      }}
                    </div>
                    <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["UG 0-2"].betradar_difference, true, false)}}
                  </div> -->
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(item.odds["UG 0-2"].betradar)
                      }}
                    </div>
                    <div class="col-md-6 feed">
                      <!-- {{ avoidNullAndConvertToFixed(item.odds["UG 0-2"].asian) }} -->/
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(
                          getOddForSelectedPayout(item, "UG 0-2", "goals")
                        )
                      }}
                    </div>
                    <div class="col-md-6">&nbsp;</div>
                  </div>
                </div>
                <div class="col-md-4 alignRows">
                  <div class="row">
                    <div
                      class="col-md-12 prod"
                      v-bind:style="[
                        avoidNull(item.odds['UG 3+']['betradar_difference']) < 0
                          ? {
                              color: getDangerColor(),
                              backgroundColor: getDangerBgColor(),
                            }
                          : { color: getColorAccordingToStyle() },
                      ]"
                    >
                      {{
                        avoidNullAndConvertToFixed(
                          item.odds["UG 3+"].production
                        )
                      }}
                    </div>
                    <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["UG 3+"].betradar_difference, true, false)}}
                  </div> -->
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(item.odds["UG 3+"].betradar)
                      }}
                    </div>
                    <div class="col-md-6 feed">
                      <!-- {{ avoidNullAndConvertToFixed(item.odds["UG 3+"].asian) }} -->/
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 betradar">
                      {{
                        avoidNullAndConvertToFixed(
                          getOddForSelectedPayout(item, "UG 3+", "goals")
                        )
                      }}
                    </div>
                    <div class="col-md-6">&nbsp;</div>
                  </div>
                </div>
                <div class="col-md-2 bela payoutGoals">
                  <div class="row">
                    <div class="col-md-12">
                      {{ calculatePayout(item.odds, "goals") }}
                    </div>
                  </div>
                  <div class="row mtop25">
                    <div class="col-md-12">
                      {{ calculateObaranjePayout(item) }}
                    </div>
                  </div>
                </div>
                <div class="col-md-2 plus">
                  <i
                    class="fa fa-plus"
                    v-on:click.stop="showMoreOdds(item.Code)"
                  ></i>
                  <span class="badOdds">{{
                    avoidNull(item.num_outcomes_betradar)
                  }}</span
                  ><br />
                  <span class="badOdds">N/A</span>
                  <span class="badOdds removeMatch"
                    ><i
                      class="fa fa-remove"
                      v-on:click.stop="hideMatch(item.Code)"
                    ></i
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </VueAutoVirtualScrollList>
        <div class="row mec no-data" v-if="data.primary.length == 0">
          Ne postoje mečevi za zadati kriterijum
        </div>
      </div>
      <div class="col-md-6 side side-right" v-if="modes.odds">
        <table class="table table-striped additionalOdds">
          <thead>
            <th colspan="4">
              MEČ: {{ selectedMatch.homeCompetitorName }} -
              {{ selectedMatch.awayCompetitorName }} (&nbsp;<span
                class="copyTo"
                v-on:click="copyToClipboard(selectedMatch.Code)"
                >{{ selectedMatch.Code }}&nbsp;)</span
              >
            </th>
            <th colspan="3">
              <span
                ><input
                  type="text"
                  v-model="searchTerms.outcome"
                  class="form-control pretragaTipa"
                  v-on:keyup="searchBetType"
                  placeholder="Pretraži tip igre..."
                /><i
                  v-on:click="showMoreOdds(null)"
                  class="fa fa-window-close"
                ></i>
              </span>
            </th>
          </thead>
          <tr>
            <th>Grupa</th>
            <th>Tip Igre</th>
            <th>Produkcija</th>
            <th>Betradar</th>
            <!-- <th>Asian</th> -->
            <th>
              Br Diff&nbsp;<i
                v-on:click="sortByDifference('b')"
                class="fa fa-sort"
              ></i>
            </th>
            <!-- <th>
              As Diff&nbsp;<i
                v-on:click="sortByDifference('a')"
                class="fa fa-sort"
              ></i>
            </th> -->
          </tr>

          <tr v-for="oddKey in oddsKeys" :key="oddKey" class="igre">
            <td>{{ detectGroup(oddKey) }}</td>
            <td>{{ oddKey }}</td>
            <td>
              {{
                avoidNullAndConvertToFixed(
                  selectedMatch["odds"][oddKey]["production"]
                )
              }}
            </td>
            <td>
              {{
                avoidNullAndConvertToFixed(
                  selectedMatch["odds"][oddKey]["betradar"]
                )
              }}
            </td>
            <td
              v-bind:style="[
                avoidNull(
                  selectedMatch['odds'][oddKey]['betradar_difference']
                ) < 0
                  ? { color: 'red', fontWeight: 'bold' }
                  : { color: getColorAccordingToStyle() },
              ]"
            >
              {{
                avoidNullAndConvertToFixed(
                  selectedMatch["odds"][oddKey]["betradar_difference"],
                  true,
                  true
                )
              }}
            </td>
          </tr>
        </table>
      </div>
      <div class="col-md-6 side side-right" v-if="modes.nepovezani">
        <div class="row">
          <div class="col-md-5">
            <p class="nepovezaniText">
              Manuelna kontrola ( <span>{{ countNepovezani }}</span> )
            </p>
          </div>
          <div class="col-md-1"></div>
          <div class="col-md-6"></div>
        </div>
        <div class="row basicOddsHeaderRight">
          <div class="col-md-8">
            <div class="row">
              <div class="col-md-2 basicOdds">Start</div>
              <div class="col-md-3 col-md-3-half basicOdds">Match</div>
              <div
                class="col-md-2 col-md-1-half basicOdds"
                v-for="odd in basicOdds.football1x2"
                :key="odd"
              >
                {{ odd }}
              </div>
              <div class="col-md-1 basicOdds">%</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="row">
              <div
                class="col-md-4 basicOddsGoals"
                v-for="odd in basicOdds.footballGoals"
                :key="odd"
              >
                {{ odd }}
              </div>
              <div class="col-md-2 basicOddsGoals">%</div>
              <div class="col-md-2 basicOddsGoals">
                <i class="fas fa-undo-alt"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="row mec" v-for="item in data.hidden" :key="item.Code">
          <!-- <div class="col-md-1 level">
            {{ item.level_betradar.toFixed(2) }}<br />
            {{ item.level_asian.toFixed(2) }}
          </div> -->
          <div
            class="col-md-8 teamNamesHolder"
            v-bind:style="[checkColor(item.level_betradar)]"
          >
            <div class="row">
              <div class="col-md-2 league-and-date">
                <b
                  >{{ new Date(item.startDate).getDate() }}.
                  {{ months[new Date(item.startDate).getMonth()] }}
                </b>
                <br />
                <span class="kr">{{
                  days[new Date(item.startDate).getDay()]
                }}</span
                ><br />
                <b
                  >{{ new Date(item.startDate).getHours() }}:{{
                    new Date(item.startDate).getMinutes().toString().length == 1
                      ? "0" + new Date(item.startDate).getMinutes()
                      : new Date(item.startDate).getMinutes()
                  }}</b
                >
              </div>
              <div class="col-md-3 col-md-3-half team-names">
                <a
                  class="teamLinks teamLiga"
                  :title="item.liga"
                  v-on:click.stop="
                    openUrl(
                      'http://10.0.90.252:81/index.php/utakmica/kvoteExpress/action?server=1&liga=' +
                        item.liga,
                      'child'
                    )
                  "
                  ><img
                    src="../assets/rezalica.png"
                    class="mainTeamLinks"
                    width="10" />&nbsp;&nbsp;{{ item.liga }}<br
                /></a>
                <a
                  class="teamLinks teamName"
                  :title="item.homeCompetitorName"
                  v-on:click.stop="
                    openUrl(
                      'https://www.oddsportal.com/search/' +
                        item.homeCompetitorName,
                      'child2'
                    )
                  "
                  ><b>{{ item.homeCompetitorName }}</b></a
                ><br />
                <a
                  class="teamLinks teamName"
                  :title="item.awayCompetitorName"
                  v-on:click.stop="
                    openUrl(
                      'https://www.oddsportal.com/search/' +
                        item.awayCompetitorName,
                      'child2'
                    )
                  "
                  ><b>{{ item.awayCompetitorName }}</b></a
                >
              </div>
              <div class="col-md-2 col-md-1-half alignRows">
                <div class="row">
                  <div
                    class="col-md-12 prod"
                    v-bind:style="[
                      avoidNull(item.odds['KI 1']['betradar_difference']) < 0
                        ? {
                            color: getDangerColor(),
                            backgroundColor: getDangerBgColor(),
                          }
                        : { color: getColorAccordingToStyle() },
                    ]"
                  >
                    {{
                      avoidNullAndConvertToFixed(item.odds["KI 1"].production)
                    }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI 1"].betradar_difference, true, false)}}
                  </div> -->
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{ avoidNullAndConvertToFixed(item.odds["KI 1"].betradar) }}
                  </div>
                  <div class="col-md-6 feed">
                    <!-- {{ avoidNullAndConvertToFixed(item.odds["KI 1"].asian) }} -->/
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{
                      avoidNullAndConvertToFixed(
                        getOddForSelectedPayout(item, "KI 1", "1x2")
                      )
                    }}
                  </div>
                  <div class="col-md-3">&nbsp;</div>
                </div>
              </div>
              <div class="col-md-2 col-md-1-half alignRows">
                <div class="row">
                  <div
                    class="col-md-12 prod"
                    v-bind:style="[
                      avoidNull(item.odds['KI X']['betradar_difference']) < 0
                        ? {
                            color: getDangerColor(),
                            backgroundColor: getDangerBgColor(),
                          }
                        : { color: getColorAccordingToStyle() },
                    ]"
                  >
                    {{
                      avoidNullAndConvertToFixed(item.odds["KI X"].production)
                    }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI X"].betradar_difference, true, false)}}
                  </div> -->
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{ avoidNullAndConvertToFixed(item.odds["KI X"].betradar) }}
                  </div>
                  <div class="col-md-6 feed">
                    <!-- {{ avoidNullAndConvertToFixed(item.odds["KI X"].asian) }} -->/
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{
                      avoidNullAndConvertToFixed(
                        getOddForSelectedPayout(item, "KI X", "1x2")
                      )
                    }}
                  </div>
                  <div class="col-md-3">&nbsp;</div>
                </div>
              </div>
              <div class="col-md-2 col-md-1-half alignRows">
                <div class="row">
                  <div
                    class="col-md-12 prod"
                    v-bind:style="[
                      avoidNull(item.odds['KI 2']['betradar_difference']) < 0
                        ? {
                            color: getDangerColor(),
                            backgroundColor: getDangerBgColor(),
                          }
                        : { color: getColorAccordingToStyle() },
                    ]"
                  >
                    {{
                      avoidNullAndConvertToFixed(item.odds["KI 2"].production)
                    }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI 2"].betradar_difference, true, false)}}
                  </div> -->
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{ avoidNullAndConvertToFixed(item.odds["KI 2"].betradar) }}
                  </div>
                  <div class="col-md-6 feed">
                    <!-- {{ avoidNullAndConvertToFixed(item.odds["KI 2"].asian) }} -->/
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{
                      avoidNullAndConvertToFixed(
                        getOddForSelectedPayout(item, "KI 2", "1x2")
                      )
                    }}
                  </div>
                  <div class="col-md-6">&nbsp;</div>
                </div>
              </div>
              <div class="col-md-1 bela negmar">
                <div class="row">
                  <div class="col-md-12">
                    {{ calculatePayout(item.odds, "1x2") }}
                  </div>
                </div>
                <div class="row mtop25">
                  <div class="col-md-12">
                    <select
                      class="suggestionsList"
                      v-model="item.closest1x2Payout"
                      @click.stop="onGoalsPayoutChange($event, item)"
                    >
                      <option value="98">98%</option>
                      <option value="96">96%</option>
                      <option value="94">94%</option>
                      <option value="92">92%</option>
                      <option value="90">90%</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="row basicOddsData">
              <div class="col-md-4 alignRows">
                <div class="row">
                  <div
                    class="col-md-12 prod"
                    v-bind:style="[
                      avoidNull(item.odds['UG 0-2']['betradar_difference']) < 0
                        ? {
                            color: getDangerColor(),
                            backgroundColor: getDangerBgColor(),
                          }
                        : { color: getColorAccordingToStyle() },
                    ]"
                  >
                    {{
                      avoidNullAndConvertToFixed(item.odds["UG 0-2"].production)
                    }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["UG 0-2"].betradar_difference, true, false)}}
                  </div> -->
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{
                      avoidNullAndConvertToFixed(item.odds["UG 0-2"].betradar)
                    }}
                  </div>
                  <div class="col-md-6 feed">
                    <!-- {{ avoidNullAndConvertToFixed(item.odds["UG 0-2"].asian) }} -->/
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{
                      avoidNullAndConvertToFixed(
                        getOddForSelectedPayout(item, "UG 0-2", "goals")
                      )
                    }}
                  </div>
                  <div class="col-md-6">&nbsp;</div>
                </div>
              </div>
              <div class="col-md-4 alignRows">
                <div class="row">
                  <div
                    class="col-md-12 prod"
                    v-bind:style="[
                      avoidNull(item.odds['UG 3+']['betradar_difference']) < 0
                        ? {
                            color: getDangerColor(),
                            backgroundColor: getDangerBgColor(),
                          }
                        : { color: getColorAccordingToStyle() },
                    ]"
                  >
                    {{
                      avoidNullAndConvertToFixed(item.odds["UG 3+"].production)
                    }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["UG 3+"].betradar_difference, true, false)}}
                  </div> -->
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{
                      avoidNullAndConvertToFixed(item.odds["UG 3+"].betradar)
                    }}
                  </div>
                  <div class="col-md-6 feed">
                    <!-- {{ avoidNullAndConvertToFixed(item.odds["UG 3+"].asian) }} -->/
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 betradar">
                    {{
                      avoidNullAndConvertToFixed(
                        getOddForSelectedPayout(item, "UG 3+", "goals")
                      )
                    }}
                  </div>
                  <div class="col-md-6">&nbsp;</div>
                </div>
              </div>
              <div class="col-md-2 bela payoutGoals">
                <div class="row">
                  <div class="col-md-12">
                    {{ calculatePayout(item.odds, "goals") }}
                  </div>
                </div>
                <div class="row mtop25">
                  <div class="col-md-12">
                    {{ calculateObaranjePayout(item) }}
                  </div>
                </div>
              </div>
              <div class="col-md-2 plus">
                <i
                  @click.prevent="showMatch(item.Code)"
                  class="fas fa-undo-alt nazad"
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div
          class="row mec"
          v-for="item in data.nepovezani.mecevi"
          :key="item.homeCompetitorName + ' ' + item.awayCompetitorName"
        >
          <!-- <div class="col-md-1 level">
            {{ item.level_betradar.toFixed(2) }}<br />
            {{ item.level_asian.toFixed(2) }}
          </div> -->
          <div class="col-md-8 teamNamesHolder">
            <div class="row">
              <div class="col-md-2 league-and-date">
                <b
                  >{{ new Date(item.startDate).getDate() }}.
                  {{ months[new Date(item.startDate).getMonth()] }} </b
                ><br />
                <span class="kr">
                  {{ days[new Date(item.startDate).getDay()] }}</span
                ><br />

                <b>
                  {{ new Date(item.startDate).getHours() }}:{{
                    new Date(item.startDate).getMinutes().toString().length == 1
                      ? "0" + new Date(item.startDate).getMinutes()
                      : new Date(item.startDate).getMinutes()
                  }}
                </b>
              </div>
              <div class="col-md-3 col-md-3-half team-names">
                <a
                  class="teamLinks"
                  v-on:click.stop="
                    openUrl(
                      'http://10.0.90.252:81/index.php/utakmica/kvoteExpress/action?server=1&liga=' +
                        item.liga,
                      'child'
                    )
                  "
                  >{{ item.liga }}<br
                /></a>
                <a
                  class="teamLinks"
                  v-on:click.stop="
                    openUrl(
                      'https://www.oddsportal.com/search/' +
                        item.homeCompetitorName,
                      'child2'
                    )
                  "
                  ><b>{{ item.homeCompetitorName }}</b></a
                ><br />
                <a
                  class="teamLinks"
                  v-on:click.stop="
                    openUrl(
                      'https://www.oddsportal.com/search/' +
                        item.awayCompetitorName,
                      'child2'
                    )
                  "
                  ><b>{{ item.awayCompetitorName }}</b></a
                >
              </div>
              <div class="col-md-2 col-md-1-half alignRows">
                <div class="row">
                  <div class="col-md-12 prod">
                    {{ avoidNullAndConvertToFixed(item["K1"]) }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI 1"].betradar_difference, true, false)}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-2 col-md-1-half alignRows">
                <div class="row">
                  <div class="col-md-12 prod">
                    {{ avoidNullAndConvertToFixed(item["KX"]) }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI X"].betradar_difference, true, false)}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-2 col-md-1-half alignRows">
                <div class="row">
                  <div class="col-md-12 prod">
                    {{ avoidNullAndConvertToFixed(item["K2"]) }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["KI 2"].betradar_difference, true, false)}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-1 bela negmar">
                {{ calculatePayout(item, "1x2xN") }}
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="row basicOddsData">
              <div class="col-md-4 alignRows">
                <div class="row">
                  <div class="col-md-12 prod">
                    {{ avoidNullAndConvertToFixed(item["G0-2"]) }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["UG 0-2"].betradar_difference, true, false)}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-4 alignRows">
                <div class="row">
                  <div class="col-md-12 prod">
                    {{ avoidNullAndConvertToFixed(item["G3+"]) }}
                  </div>
                  <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(item.odds["UG 3+"].betradar_difference, true, false)}}
                  </div> -->
                </div>
              </div>
              <div class="col-md-4 bela payoutGoals">
                {{ calculatePayout(item, "goalsn") }}
              </div>
              <!-- <div class="col-md-2 plus">
                <a
                  :href="'https://www.oddsportal.com/search/' + getUrl(item)"
                  target="_blank"
                  ><i class="fa fa-globe mtop10"></i
                ></a>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-context ref="menu" v-slot="data">
      <li>
        <a href="#" @click.prevent="contextAction('rezalica', data.data.item)"
          ><img class="contextIcon" src="../assets/rezalica.png" width="10"
        /></a>
      </li>
      <li>
        <a href="#" @click.prevent="contextAction('oddsportal', data.data.item)"
          ><img class="contextIcon" src="../assets/oddsportal.png" width="20"
        /></a>
      </li>
      <li>
        <a href="#" @click.prevent="contextAction('bmbets', data.data.item)"
          ><img class="contextIcon" src="../assets/bmbet.png" width="20"
        /></a>
      </li>
      <li>
        <a href="#" @click.prevent="contextAction('soccer', data.data.item)"
          ><img class="contextIcon" src="../assets/soccerlogo2.png" width="20"
        /></a>
      </li>
    </vue-context>


    <!-- <div class="loading" ref="loadingBar" id="loadingBar">
      <div class="uil-ring-css ring">
        <div></div>
      </div>
    </div> -->
    <div class="help">
      <i v-on:click="openHelp()" class="fas fa-question-circle"></i>
    </div>
    <div id="help" class="modal">
      <!-- Modal content -->
      <div class="modal-content">
        <div class="row">
          <div class="col-md-6">
            <h1>Monitoring v2.0 (stable)</h1>
          </div>
          <div class="col-md-6">
            <span v-on:click="closeHelp()" class="close">&times;</span>
          </div>
        </div>
        <hr />
        <div class="ro">
          <div class="col-md-12">
            <h2>Izmene:</h2>
            <ul class="help-list">
              <li>
                - Svi mečevi koji počinju danas do 23:59 imaju oznaku
                <strong
                  style="
                    color: yellow;
                    background: black;
                    padding: 1px 5px 1px 5px;
                  "
                  >"Today"</strong
                >
                u koloni START.
              </li>
              <li>
                - Svi mečevi koji počinju od 00:00 do 09:00 imaju oznaku
                <strong
                  style="
                    color: lightgreen;
                    background: black;
                    padding: 1px 5px 1px 5px;
                  "
                  >"Morning"</strong
                >
                u koloni START.
              </li>
              <li>
                - Filter za <strong>odabir lige</strong> funkcioniše tako da
                prilkom odabira jedne ili više liga, prikazuju se samo utakmice
                koje odgovaraju izabranom kriterijumu nezavisno od periodičnih
                izmena na 30 sekundi.
              </li>
              <li>
                - <strong>Pretraga mečeva</strong> se vrši nad svim mečevima i
                prikazuju se samo mečevi koji odgovaraju pretrazi nezavisno od
                periodičnih izmena na 30 sekundi. Pretraga se vrši po nazivima
                timova ili nazivu lige.
              </li>
              <li>
                - <strong>Vremenski filter</strong> po default-u prikazuje sve
                mečeve, odabirom neke od ostalih opcija prikazuju se samo mečevi
                koji odgovaraju izabranom kriterijumu nezavisno od periodičnih
                izmena na 30 sekundi.
              </li>
              <li>
                - <strong>Sortiranje</strong> se uvek vrši samo nad mečevima
                koji su trenuto prikazani na stranici. (svi ili redukovani nekim
                od filtera)
              </li>
              <li>
                -
                <strong
                  >Sakriveni mečevi <span style="color: red">(x)</span></strong
                >
                se svakako osvežavaju nevezano sa tim što su prebačeni u deo za
                manuelnu kontrolu.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
const io = require("socket.io-client");
import _ from "lodash";
// const axios = require("axios").default;
// import { getFinland } from "./finland.ts";
import {
  getGroups,
  getDays,
  getMonths,
  getSVGSports,
  copyToClipboard,
  openUrl,
} from "./helper.ts";
import VueAutoVirtualScrollList from "vue-auto-virtual-scroll-list";
import VueContext from "vue-context";
// import Match from "./Match.vue";

let ostaleIgre = [];
export default {
  name: "MainPreview",
  components: {
    VueContext,
    VueAutoVirtualScrollList,
  },
  data() {
    return {
      data: {
        primary: [],
        secondary: [],
        hidden: [],
        nepovezani: { mecevi: [] },
        betRadarNepovezani: [],
        all: [],
      },
      temp: {
        nep: [],
        ids: [],
      },
      leagues: {
        data: [],
        selected: [],
      },
      recentVersions: [],
      highlightedMatch: false,
      defaultValues: {
        sort: "4",
        league: "All",
        range: "0",
      },
      countNepovezani: 0,
      countPovezani: 0,
      socket: null,
      allLiga: true,
      sortDirection: 0,
      lastReloadTime: this.startTime(),
      reloadActive: false,
      initial: true,
      originalOddKeys: [],
      searchTerms: {
        outcome: "",
        team: "",
      },
      groups: getGroups(),
      days: getDays(),
      months: getMonths(),
      basicOdds: {
        football1x2: ["1", "X", "2"],
        footballGoals: ["0-2", "3+"],
      },
      sports: getSVGSports(),
      modes: {
        odds: false,
        nepovezani: true,
      },
      oddsKeys: [],
      selectedMatch: {},
      currentCode: null,
      differenceSort: false,
      differenceArr: [],
      asianDifferenceSort: false,
      asianDifferenceArr: [],
      expaneded: false,
      defaultNA: "N/A",
    };
  },
  methods: {
    openHelp() {
      var modal = document.getElementById("help");
      modal.style.display = "block";
    },
    closeHelp() {
      var modal = document.getElementById("help");
      modal.style.display = "none";
    },
    copyToClipboard,
    openUrl,
    determineHiddenMatches(all, showedCodes) {
      let hiddenCached = JSON.parse(localStorage.getItem("hiddenMatches"));
      if (hiddenCached) {
        for (let i = 0; i < hiddenCached.length; i++) {
          if (!showedCodes.includes(hiddenCached[i]["Code"])) {
            console.log("Brisanje sakrivenog koga nema u glavnom");
            hiddenCached = hiddenCached.filter(
              (x) => x["Code"] != hiddenCached[i]["Code"]
            );
          }
        }

        let hiddenCodes = hiddenCached.map((x) => x.Code);
        for (let i = 0; i < all.length; i++) {
          if (hiddenCodes.includes(all[i]["Code"])) {
            console.log("Promena u sakrivenom");
            hiddenCached.filter((x) => x["Code"] == all[i]["Code"])[0] = all[i];
          }
        }

        return hiddenCached;
      } else {
        return [];
      }
    },
    formatMatchDate(date) {
      var today = new Date();
      var date = new Date(date);
      var isToday =
        date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear();

      var today2 = new Date();
      let diff = -1000;
      if (today2.getHours() >= 9) {
        today2.setHours(0, 0, 0, 0);
        var dateTomorrow = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1
        );
        if (
          dateTomorrow.getFullYear() == date.getFullYear() &&
          dateTomorrow.getMonth() == date.getMonth() &&
          dateTomorrow.getDate() == date.getDate()
        ) {
          diff = date.getHours() - today2.getHours();
        }
      } else {
        if (isToday) {
          diff = date.getHours() - today2.getHours();
        }
      }
      if (diff >= 0 && diff <= 9) {
        return "<span style='color:#00C853'>Morning</today>";
      } else if (isToday) {
        return "<span style='color:yellow'>Today</today>";
      } else {
        return (
          `<span>` +
          new Date(date).getDate() +
          `.` +
          this.months[new Date(date).getMonth()] +
          `</span>`
        );
      }
    },
    teamSearch(evt) {
      this.toggleLiga(true);
      let term = evt.target.value;
      this.defaultValues.range = "0";
      this.teamRangeChange(
        { target: { value: this.defaultValues.range } },
        "search"
      );
      let dataSource = _.cloneDeep(this.data.primary);
      if (!term) {
        this.data.primary = _.cloneDeep(this.data.secondary);
        this.onSortChange({ target: { value: this.defaultValues.sort } });
      } else {
        dataSource = dataSource.filter(
          (x) =>
            x.homeCompetitorName.toLowerCase().indexOf(term.toLowerCase()) !=
              -1 ||
            x.awayCompetitorName.toLowerCase().indexOf(term.toLowerCase()) !=
              -1 ||
            x.liga.toLowerCase().indexOf(term.toLowerCase()) != -1
        );
      }
      this.data.primary = dataSource;
      this.onSortChange({ target: { value: this.defaultValues.sort } });
    },
    determineHeight(type) {
      switch (type) {
        case "hidden":
          return this.data.hidden.length * 92;
        case "nepovezani":
          return this.data.nepovezani.mecevi.length * 92;
      }
    },
    toggleLiga(e) {
      if (!e) {
        this.$nextTick(() => {
          //Prevencija odcekiranja svih liga
          this.allLiga = true;
        });
      } else {
        var checkboxes = document
          .getElementById("checkboxes")
          .getElementsByTagName("input");
        for (let i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i]) {
            checkboxes[i].checked = false;
          }
        }
        this.data.primary = _.cloneDeep(this.data.secondary);
        this.leagues.selected = [];
        this.allLiga = true;
        this.onSortChange({ target: { value: this.defaultValues.sort } });
      }
    },
    filterLiga(e) {
      this.searchTerms.team = "";
      this.defaultValues.range = "0";
      this.teamRangeChange(
        { target: { value: this.defaultValues.range } },
        "filterLiga"
      );
      let liga = e.target.id;
      let checked = e.target.checked;
      if (checked) {
        this.leagues.selected.push(e.target.id);
      } else if (!checked) {
        this.leagues.selected = this.leagues.selected.filter((x) => x != liga);
      }
      if (this.leagues.selected == 0) {
        this.defaultValues.league = "All";
        this.allLiga = true;
        this.data.primary = _.cloneDeep(this.data.secondary);
        this.onSortChange({ target: { value: this.defaultValues.sort } });
        return;
      } else {
        this.defaultValues.league = null;
        this.allLiga = null;
        this.data.primary = _.cloneDeep(this.data.secondary);
        this.data.primary = this.data.primary.filter((x) =>
          this.leagues.selected.includes(x.liga)
        );
        this.onSortChange({ target: { value: this.defaultValues.sort } });
      }
    },
    showCheckboxes() {
      var checkboxes = document.getElementById("checkboxes");
      if (!this.expanded) {
        checkboxes.style.display = "block";
        this.expanded = true;
      } else {
        checkboxes.style.display = "none";
        this.expanded = false;
      }
    },
    hideCheckboxes() {
      var checkboxes = document.getElementById("checkboxes");
      checkboxes.style.display = "none";
      this.expanded = false;
    },
    contextAction(type, item) {
      switch (type) {
        case "rezalica":
          this.openUrl(
            "http://10.0.90.252:81/index.php/utakmica/kvoteExpress/action?server=1&liga=" +
              item.liga,
            "child"
          );
          break;
        case "oddsportal":
          this.openUrl(
            "https://www.oddsportal.com/search/" + item.homeCompetitorName,
            "child2"
          );
          break;
        case "bmbets":
          this.openUrl(
            "http://www.bmbets.com/search/?query=" + item.homeCompetitorName,
            "child3"
          );
          break;
        case "soccer":
          this.openUrl("http://www.soccerbet.rs", "child4");
          break;
        default:
          this.openUrl("http://www.soccerbet.rs", "child4");
          break;
      }
    },
    highlightMatch(id) {
      if (!this.$refs.menu.show) {
        if (id == this.highlightedMatch) {
          this.highlightedMatch = false;
        } else {
          this.highlightedMatch = id;
        }
      }
    },
    onGoalsPayoutChange(e, item) {
      item.closestGoalsPayout = e.target.value;
    },
    getOddForSelectedPayout(item, odd, type) {
      return type == "1x2"
        ? item.odds[odd].obaranje['betradar'][item.closest1x2Payout]
        : item.odds[odd].obaranje['betradar'][item.closestGoalsPayout];
    },
    addClosestPayouts(all, razlika) {
      all.forEach((match) => {
        if (razlika) {
          if (!razlika.includes(match.Code)) {
            return;
          }
        }
        let payout1x2 = this.calculatePayout(match.odds, "1x2");
        let num1x2 = payout1x2;
        if (num1x2 <= 90.9) {
          match.closest1x2Payout = "90";
          match.closestGoalsPayout = "90";
        } else if (num1x2 > 90.9 && num1x2 <= 92.9) {
          match.closest1x2Payout = "92";
          match.closestGoalsPayout = "92";
        } else if (num1x2 > 92.9 && num1x2 <= 94.9) {
          match.closest1x2Payout = "94";
          match.closestGoalsPayout = "94";
        } else if (num1x2 > 94.2 && num1x2 <= 96.9) {
          match.closest1x2Payout = "96";
          match.closestGoalsPayout = "96";
        } else {
          match.closest1x2Payout = "98";
          match.closestGoalsPayout = "98";
        }
      });
    },
    hideMatch(code) {
      if (this.reloadActive) {
        let toBeHidden = _.cloneDeep(
          this.data.primary.filter((x) => x["Code"] == code)[0]
        );
        this.data.hidden.unshift(toBeHidden);
        this.data.primary = this.data.primary.filter((x) => x["Code"] != code);
        this.data.secondary = this.data.secondary.filter(
          (x) => x["Code"] != code
        );
        this.countPovezani = this.data.secondary.length;
        this.onSortChange({ target: { value: this.defaultValues.sort } });
        localStorage.setItem("hiddenMatches", JSON.stringify(this.data.hidden));
      }
    },
    showMatch(code) {
      this.toggleLiga(true);
      this.data.primary.push(this.data.hidden.filter((x) => x.Code == code)[0]);
      this.data.secondary.push(
        this.data.hidden.filter((x) => x.Code == code)[0]
      );
      this.data.hidden = this.data.hidden.filter((x) => x.Code != code);
      this.countPovezani = this.data.secondary.length;
      this.onSortChange({ target: { value: this.defaultValues.sort } });
      this.teamRangeChange({ target: { value: this.defaultValues.range } });
      localStorage.setItem("hiddenMatches", JSON.stringify(this.data.hidden));
    },
    getDangerBgColor() {
      return "papayawhip";
    },
    getDangerColor() {
      return "red";
    },
    getColorAccordingToStyle() {
      return "white";
    },
    transformNepovezani(all, source) {
      this.all = all;
      if (source == "initial") {
        this.prepareLazyData();
      }
      this.temp.nep = [];
      this.temp.ids = [];
      this.determineBetradarNepovezani();
      this.removeBetradarNepovezaniFromPrimary();
      this.determineDbNepovezani();
      this.sortAndCountNepovezani();
      if (source == "initial") {
        this.alignSources();
        this.assignAndSortLeagues();
      } else {
        let DIFF = true;
        this.assignAndSortLeagues(DIFF);
      }
      this.countPrimary();
    },
    countPrimary() {
      this.countPovezani = this.data.secondary.length;
    },
    alignSources() {
      this.data.primary = this.all;
      this.data.secondary = this.all;
    },
    assignAndSortLeagues(diff = false) {
      if (diff) {
        let razlikaLige = [...new Set(this.all.map((x) => x.liga))];
        this.leagues.data = this.leagues.data.filter((x) => x != "All");
        for (let i = 0; i < razlikaLige.length; i++) {
          if (!this.leagues.data.includes(razlikaLige[i])) {
            this.leagues.data.push(razlikaLige[i]);
          }
        }
        this.leagues.data.sort(function (a, b) {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });
      } else {
        this.leagues.data = [...new Set(this.data.primary.map((x) => x.liga))];
        this.leagues.data.sort(function (a, b) {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });
      }
    },
    sortAndCountNepovezani() {
      this.countNepovezani = this.data.nepovezani["mecevi"].length;
      this.data.nepovezani["mecevi"].sort(function (a, b) {
        return new Date(a.startDate) - new Date(b.startDate);
      });
    },
    determineDbNepovezani() {
      let names = this.data.nepovezani["mecevi"].map(
        (x) => x.homeCompetitorName + " " + x.awayCompetitorName
      ); //id nepovezanih meceva iz fajla
      for (let i = 0; i < this.temp.nep.length; i++) {
        if (
          !names.includes(
            this.temp.nep[i].homeCompetitorName +
              " " +
              this.temp.nep[i].awayCompetitorName
          ) //ako u fajlu nema onih koji su sa kvotama 0
        ) {
          this.data.nepovezani["mecevi"].push(this.temp.nep[i]);
          this.data.betRadarNepovezani.push(this.temp.nep[i]);
        }
      }
      this.data.nepovezani["mecevi"] = this.data.nepovezani["mecevi"].filter(
        (x) => new Date(x.startDate) > new Date()
      );
    },
    removeBetradarNepovezaniFromPrimary() {
      this.all = this.all.filter(
        (x) =>
          !this.temp.ids.includes(x["Code"]) &&
          !this.data.hidden.map((x) => x.Code).includes(x["Code"])
      );
    },
    determineBetradarNepovezani() {
      for (let i = 0; i < this.all.length; i++) {
        if (
          this.all[i]["odds"]["KI 1"]["betradar"] == 0 &&
          this.all[i]["odds"]["KI X"]["betradar"] == 0 &&
          this.all[i]["odds"]["KI 2"]["betradar"] == 0
        ) {
          this.temp.nep.push({
            homeCompetitorName: this.all[i]["homeCompetitorName"],
            awayCompetitorName: this.all[i]["awayCompetitorName"],
            startDate: this.all[i]["startDate"],
            liga: this.all[i]["liga"],
            K1: this.all[i]["odds"]["KI 1"]["production"],
            K2: this.all[i]["odds"]["KI 2"]["production"],
            KX: this.all[i]["odds"]["KI X"]["production"],
            "G0-2": this.all[i]["odds"]["UG 0-2"]["production"],
            "G3+": this.all[i]["odds"]["UG 3+"]["production"],
          });
          this.temp.ids.push(this.all[i]["Code"]);
        }
      }
    },
    prepareLazyData() {
      this.all.forEach((x) => {
        let code = x.Code;
        ostaleIgre.push({
          liga: x.liga,
          Code: code,
          odds: _.cloneDeep(x.odds),
          homeCompetitorName: x.homeCompetitorName,
          awayCompetitorName: x.awayCompetitorName,
        });
        Object.keys(x.odds).forEach((el) => {
          if (
            el != "KI 1" &&
            el != "KI X" &&
            el != "KI 2" &&
            el != "UG 0-2" &&
            el != "UG 3+"
          ) {
            delete x.odds[el];
          }
        });
      });
    },
    getUrl(item) {
      if (item.homeCompetitorName.includes("/")) {
        return item.awayCompetitorName;
      } else {
        return item.homeCompetitorName;
      }
    },
    finished() {
      this.socket.emit("difference", { versions: this.recentVersions });
    },
    teamRangeChange(e, source) {
      if (source != "search") this.searchTerms.team = "";
      if (!source) {
        this.allLiga = true;
        var checkboxes = document
          .getElementById("checkboxes")
          .getElementsByTagName("input");
        for (let i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i]) {
            checkboxes[i].checked = false;
          }
        }
      }
      let val = e.target.value;
      let dataSource = this.data.secondary;
      switch (val) {
        case "0":
          break;
        case "1":
          var dt = new Date();
          dt.setHours(dt.getHours() + 3);
          dataSource = dataSource.filter((x) => new Date(x.startDate) <= dt);
          break;
        case "2":
          var dt = new Date();
          dt.setDate(dt.getDate() + 1);
          dt.setHours(0, 0, 0, 0);
          dataSource = dataSource.filter((x) => new Date(x.startDate) <= dt);
          break;
        case "3":
          var dt = new Date();
          dt.setDate(dt.getDate() + 3);
          dataSource = dataSource.filter((x) => new Date(x.startDate) <= dt);
          break;
      }
      this.data.primary = dataSource;
      this.onSortChange({ target: { value: this.defaultValues.sort } });
    },
    onSortChange(e) {
      let val = e.target.value;
      switch (val) {
        case "1":
          this.data.primary.sort(function (a, b) {
            return a.level_betradar - b.level_betradar;
          });
          break;
        case "2":
          this.data.primary.sort(function (a, b) {
            return new Date(a.startDate) - new Date(b.startDate);
          });
          break;
        case "3":
          this.data.primary.sort(function (a, b) {
            return new Date(b.startDate) - new Date(a.startDate);
          });
          break;
        case "4":
          var losi = this.data.primary.filter(
            (x) =>
              x.odds["KI 1"]["betradar_difference"] < 0 ||
              x.odds["KI X"]["betradar_difference"] < 0 ||
              x.odds["KI 2"]["betradar_difference"] < 0 ||
              x.odds["UG 0-2"]["betradar_difference"] < 0 ||
              x.odds["UG 3+"]["betradar_difference"] < 0
          );
          losi.sort(function (a, b) {
            return a.level_betradar - b.level_betradar;
          });
          var dobri = this.data.primary.filter(
            (x) =>
              x.odds["KI 1"]["betradar_difference"] >= 0 &&
              x.odds["KI X"]["betradar_difference"] >= 0 &&
              x.odds["KI 2"]["betradar_difference"] >= 0 &&
              x.odds["UG 0-2"]["betradar_difference"] >= 0 &&
              x.odds["UG 3+"]["betradar_difference"] >= 0
          );
          dobri.sort(function (a, b) {
            return a.level_betradar - b.level_betradar;
          });
          this.data.primary = losi.concat(dobri);
          break;
      }
    },
    sortByStartDate() {
      let self = this;
      this.sortDirection == 0
        ? (this.sortDirection = 1)
        : (this.sortDirection = 0);
      this.data.primary.sort(function (a, b) {
        return self.sortDirection == 0
          ? new Date(a.startDate) - new Date(b.startDate)
          : new Date(b.startDate) - new Date(a.startDate);
      });
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    startTime() {
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();
      var s = today.getSeconds();
      // add a zero in front of numbers<10
      m = this.checkTime(m);
      s = this.checkTime(s);

      return h + ":" + m + ":" + s;
    },
    checkColor(betradar) {
      // var level = betradar < asian ? betradar : asian
      var level = betradar;
      if (level >= 0) return { borderLeft: "7px solid green" };
      if (level < 0 && level >= -0.1) {
        return { borderLeft: "7px solid yellow" };
      } else if (level < -0.1 && level >= -0.3) {
        return { borderLeft: "7px solid red" };
      } else {
        return { borderLeft: "7px solid darkred" };
      }
    },
    calculateObaranjePayout(item) {
      let p1 = this.avoidNullAndConvertToFixed(
        this.getOddForSelectedPayout(item, "UG 0-2", "goals")
      );
      let p2 = this.avoidNullAndConvertToFixed(
        this.getOddForSelectedPayout(item, "UG 3+", "goals")
      );
      return ((1 / (1 / p1 + 1 / p2)) * 100).toFixed(2);
    },
    calculatePayout(odds, type) {
      switch (type) {
        case "1x2":
          return (
            (1 /
              (1 / odds["KI 1"]["production"] +
                1 / odds["KI X"]["production"] +
                1 / odds["KI 2"]["production"])) *
            100
          ).toFixed(2);
        case "goals":
          return (
            (1 /
              (1 / odds["UG 0-2"]["production"] +
                1 / odds["UG 3+"]["production"])) *
            100
          ).toFixed(2);
        case "1x2xN":
          return (
            (1 / (1 / odds["K1"] + 1 / odds["KX"] + 1 / odds["K2"])) *
            100
          ).toFixed(2);
        case "goalsn":
          return ((1 / (1 / odds["G0-2"] + 1 / odds["G3+"])) * 100).toFixed(2);
      }
    },
    searchBetType(evt) {
      this.oddsKeys = _.cloneDeep(this.originalOddKeys);
      this.oddsKeys = this.oddsKeys.filter(
        (x) => x.toLowerCase().indexOf(evt.target.value.toLowerCase()) != -1
      );
    },
    showMoreOdds(code) {
      if (!code || this.currentCode == code) {
        this.searchTerms.outcome = "";
        this.modes.nepovezani = true;
      }
      this.allMatches = this.data.primary;
      if (this.currentCode != code && code != null) {
        this.differenceArr = [];
        this.currentCode = code;
        this.modes.nepovezani = false;
        this.modes.odds = true;
        this.selectedMatch = ostaleIgre.filter((x) => x.Code == code)[0];
        let odds = this.selectedMatch.odds;
        Object.keys(odds).forEach((el) => {
          if (el != "code" && el != "matchId" && el != "betradar_id")
            this.differenceArr.push({
              key: el,
              diff: odds[el]["betradar_difference"]
                ? odds[el]["betradar_difference"]
                : null,
            });
        });
        this.differenceArr.sort(function (a, b) {
          return a.diff - b.diff;
        });

        this.oddsKeys = this.differenceArr.map((x) => x.key);
        this.originalOddKeys = _.cloneDeep(this.oddsKeys);
      } else {
        this.modes.odds = false;
        this.currentCode = null;
        this.differenceArr = [];
        this.asianDifferenceArr = [];
        this.differenceSort = false;
        this.asianDifferenceSort = false;
      }
    },
    detectGroup(oddKey) {
      let toReturn = "";
      for (let i = 0; i < this.groups.groups.length; i++) {
        let subgroups = this.groups.groups[i].subgroups;
        Object.keys(subgroups).forEach((key) => {
          if (subgroups[key].includes(oddKey)) toReturn = key;
        });
      }
      return toReturn;
    },
    avoidNullAndConvertToFixed(odd, isDifference, round) {
      if (odd) {
        return isDifference
          ? round
            ? (odd * 100).toFixed(2) + "%"
            : Math.round(odd * 100) + "%"
          : odd.toFixed(2);
      } else {
        return this.defaultNA;
      }
    },
    avoidNull(num) {
      return num ? num : this.defaultNA;
    },
    sortByDifference(source) {
      if (source == "b") {
        this.differenceSort = !this.differenceSort;
        if (!this.differenceSort) {
          this.differenceArr.sort(function (a, b) {
            return a.diff - b.diff;
          });
        } else {
          this.differenceArr.sort(function (a, b) {
            return b.diff - a.diff;
          });
        }
        this.oddsKeys = this.differenceArr.map((x) => x.key);
      }
      if (source == "a") {
        this.asianDifferenceSort = !this.asianDifferenceSort;
        if (this.asianDifferenceArr.length == 0) {
          let odds = this.selectedMatch.odds;
          Object.keys(odds).forEach((el) => {
            if (el != "code" && el != "matchId" && el != "betradar_id")
              this.asianDifferenceArr.push({
                key: el,
                diff: odds[el]["asian_difference"]
                  ? odds[el]["asian_difference"]
                  : null,
              });
          });
        }
        if (!this.asianDifferenceSort) {
          this.asianDifferenceArr.sort(function (a, b) {
            return a.diff - b.diff;
          });
        } else {
          this.asianDifferenceArr.sort(function (a, b) {
            return b.diff - a.diff;
          });
        }
        this.oddsKeys = this.asianDifferenceArr.map((x) => x.key);
      }
    },
    doOstaleIgreDiff(razlika) {
      razlika.forEach((x) => {
        let code = x.Code;
        if (ostaleIgre.map((x) => x.Code).includes(code)) {
          ostaleIgre.filter((x) => x.Code == code)[0]["odds"] = _.cloneDeep(
            x.odds
          );
        } else {
          ostaleIgre.push({
            liga: x.liga,
            Code: code,
            odds: _.cloneDeep(x.odds),
            homeCompetitorName: x.homeCompetitorName,
            awayCompetitorName: x.awayCompetitorName,
          });
        }
        Object.keys(x.odds).forEach((el) => {
          if (
            el != "KI 1" &&
            el != "KI X" &&
            el != "KI 2" &&
            el != "UG 0-2" &&
            el != "UG 3+"
          ) {
            delete x.odds[el];
          }
        });
      });
      return razlika;
    },
    isDefaultPreview() {
      return (
        this.defaultValues.league == "All" &&
        this.defaultValues.range == "0" &&
        this.searchTerms.team == ""
      );
    },
  },
  created() {
    var socket = io.connect("http://10.0.90.23:8000", {
      upgrade: false,
      transports: ["websocket"],
    });
    this.socket = socket;
    socket.on("connect", function () {
      socket.send("User has connected!");
    });
    var self = this;
    socket.on("message", function (msg) {

      let data = msg["FD"];
      var all = [];
      Object.keys(data).forEach((key) => {
        all = all.concat(data[key]);
      });
      let showedCodes = _.cloneDeep(all.map((x) => x.Code));
      self.data.hidden = self.determineHiddenMatches(all, showedCodes);
      let hiddenCodes = self.data.hidden.map((x) => x.Code);
      self.addClosestPayouts(all);
      self.transformNepovezani(all, "initial");
      self.data.primary = self.data.primary.filter(
        (x) => !hiddenCodes.includes(x["Code"])
      );
      self.data.secondary = self.data.primary;
      self.onSortChange({ target: { value: self.defaultValues.sort } });
      var loading = document.getElementById("loadingBar");
      loading.style.display = "none";
      self.reloadActive = true;
      self.initial = false;
    });

    socket.on("difference", function (msg) {
      if (msg) {
        if (self.recentVersions.length == 2) {
          self.recentVersions = [self.recentVersions[1], msg["version"]];
        } else {
          self.recentVersions.push(msg["version"]);
        }
        if (Object.keys(msg["FD"]).length > 0) {
          self.initial = false;
          self.reloadActive = false;
          let data = msg["FD"];
          var razlika = [];
          Object.keys(data).forEach((key) => {
            razlika = razlika.concat(data[key]);
          });
          let razlikaIds = razlika.map((x) => x.matchId);
          razlika = self.doOstaleIgreDiff(razlika);
          let razlikaCodes = razlika.map((x) => x.Code);
          let hiddenCodes = self.data.hidden.map((x) => x.Code);
          if (self.isDefaultPreview()) {
            let dataSource = self.data.primary;
            //existing
            for (let i = 0; i < dataSource.length; i++) {
              if (razlikaIds.includes(dataSource[i]["matchId"])) {
                dataSource[i] = razlika.filter(
                  (x) => x.matchId == dataSource[i]["matchId"]
                )[0];
              }
            }
            let showedIds = dataSource.map((x) => x.matchId);
            //new
            for (let i = 0; i < razlika.length; i++) {
              if (
                !showedIds.includes(razlika[i]["matchId"]) &&
                !hiddenCodes.includes(razlika[i]["Code"])
              ) {
                dataSource.push(razlika[i]);
              }
            }

            for (let i = 0; i < razlika.length; i++) {
              if (hiddenCodes.includes(razlika[i]["Code"])) {
                self.data.hidden.filter((x) => x.Code == razlika[i]["Code"])[0][
                  "odds"
                ] = _.cloneDeep(
                  razlika.filter((x) => x.Code == razlika[i]["Code"])[0]["odds"]
                );
              }
            }
            localStorage.setItem(
              "hiddenMatches",
              JSON.stringify(self.data.hidden)
            );
            self.addClosestPayouts(dataSource, razlikaCodes);
            self.transformNepovezani(dataSource);
            //ALIGNING
            self.data.secondary = _.cloneDeep(self.data.primary);
          } else {
            //MODIFYING PRIMARY SOURCE

            let dataSource = self.data.primary;
            //existing
            for (let i = 0; i < dataSource.length; i++) {
              if (razlikaIds.includes(dataSource[i]["matchId"])) {
                dataSource[i] = razlika.filter(
                  (x) => x.matchId == dataSource[i]["matchId"]
                )[0];
              }
            }

            let showedIds = dataSource.map((x) => x.matchId);
            //new
            for (let i = 0; i < razlika.length; i++) {
              if (
                !showedIds.includes(razlika[i]["matchId"]) &&
                !hiddenCodes.includes(razlika[i]["Code"]) &&
                self.leagues.selected.includes(razlika[i]["liga"])
              ) {
                dataSource.push(razlika[i]);
              }
            }

            for (let i = 0; i < razlika.length; i++) {
              if (hiddenCodes.includes(razlika[i]["Code"])) {
                self.data.hidden.filter((x) => x.Code == razlika[i]["Code"])[0][
                  "odds"
                ] = _.cloneDeep(
                  razlika.filter((x) => x.Code == razlika[i]["Code"])[0]["odds"]
                );
              }
            }
            localStorage.setItem(
              "hiddenMatches",
              JSON.stringify(self.data.hidden)
            );
            self.addClosestPayouts(dataSource, razlikaCodes);
            self.transformNepovezani(dataSource);

            //MODIFYING SECONDARY SOURCE

            let dataSource2 = self.data.secondary;
            //existing
            for (let i = 0; i < dataSource2.length; i++) {
              if (razlikaIds.includes(dataSource2[i]["matchId"])) {
                dataSource2[i] = razlika.filter(
                  (x) => x.matchId == dataSource2[i]["matchId"]
                )[0];
              }
            }

            let showedIds2 = dataSource2.map((x) => x.matchId);
            //new
            for (let i = 0; i < razlika.length; i++) {
              if (
                !showedIds2.includes(razlika[i]["matchId"]) &&
                !hiddenCodes.includes(razlika[i]["Code"])
              ) {
                dataSource2.push(razlika[i]);
              }
            }
            self.addClosestPayouts(dataSource2, razlikaCodes);
            self.transformNepovezani(dataSource2);

            self.data.secondary = dataSource2;
          }
          self.onSortChange({ target: { value: self.defaultValues.sort } });
          setTimeout(() => {
            self.reloadActive = true;
          }, 1000);
          self.lastReloadTime = self.startTime();
          self.socket.emit("blocked", true);
        } else {
          self.lastReloadTime = self.startTime();
          self.reloadActive = false;
          setTimeout(() => {
            self.reloadActive = true;
          }, 1000);
        }
      } else {
        self.reloadActive = false;
        setTimeout(() => {
          self.reloadActive = true;
        }, 1000);
      }
    });

    socket.on("actual", function (msg) {
      let actual = msg["aktuelni"];
      self.data.primary = self.data.primary.filter((x) =>
        actual.includes(x["Code"])
      );
      self.data.hidden = self.data.hidden.filter((x) =>
        actual.includes(x["Code"])
      );
    });

    socket.on("blocked", function (msg) {
      let compositeNepovezani = msg["mecevi"].map(
        (x) => x.homeCompetitorName + " " + x.awayCompetitorName
      );
      self.data.nepovezani = {
        mecevi: msg["mecevi"].concat(
          _.cloneDeep(
            self.data.betRadarNepovezani.filter(
              (x) =>
                !compositeNepovezani.includes(
                  x.homeCompetitorName + " " + x.awayCompetitorName
                )
            )
          )
        ),
      };
      self.transformNepovezani(self.data.primary);
      self.socket.emit("actual", true);
    });

    socket.emit("blocked", true);
  },
  destroyed() {
    this.data.primary = [];
    this.data.secondary = [];
    this.data.nepovezani.mecevi = [];
    this.data.hidden = [];
    this.all = [];
    this.leagues.selected = [];
    ostaleIgre = [];
  },
  mounted() {
    // var loading = document.getElementById("loadingBar");
    // loading.style.display = "block";
  },
};
</script>
<style scoped>
.matchData{
  color:white;
      text-align: center;
    height: 0px;
    position: relative;
    top: 86%;
    font-family:'celtic'
}
.loader-container {
    position: fixed;
    height: 100vh;
    display: grid;
    /* place-items: center; */
    background-color: #040808;
    z-index: 9999999;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: hidden;
}

.toggle-loader {
  position: absolute;
  top: 40px;
  right: 40px;
  padding: 10px 40px;
  color: #040808;
  background-color: #2eb69c;
  box-shadow: 0 0 6px #2eb69c;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}
.toggle-loader:hover, .toggle-loader:focus {
  box-shadow: 0 0 10px #2eb69c;
}
.toggle-loader:active {
  box-shadow: 0 0 2px #2eb69c;
}

.loader {
  --loader-color: #2eb69c;
  --loader-shadow-color: #2eb69c;
  --loader-part-size: 24px;
  --loader-size: calc(var(--loader-part-size) * 3);
  position: relative;
  width: var(--loader-size);
  height: var(--loader-size);
      margin: 0 auto;
    justify-content: center;
    align-items: center;
    display: flex;
}

.loader span {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--loader-part-size);
  height: var(--loader-part-size);
  background-color: var(--loader-color);
  box-shadow: 0 0 6px var(--loader-shadow-color);
  transform-origin: center center;
  -webkit-animation: main 6s ease infinite, fading 6s ease infinite;
          animation: main 6s ease infinite, fading 6s ease infinite;
}
.loader span:nth-child(1) {
  --translationValue: calc(var(--loader-part-size) / 4),
    calc(var(--loader-part-size) / 4);
  --translationValueWhenAssebled: var(--loader-part-size), 0px;
  --translationBeforeDisassembling: calc(var(--loader-part-size) / 4),
    calc(var(--loader-part-size) / 4 * -1);
  top: 0;
  left: var(--loader-part-size);
  -webkit-animation-delay: 0s, 0.2s;
          animation-delay: 0s, 0.2s;
}
.loader span:nth-child(2) {
  --translationValue: calc(var(--loader-part-size) / 4),
    calc(var(--loader-part-size) / 4 * -1);
  --translationValueWhenAssebled: 0px, calc(var(--loader-part-size) * -1);
  --translationBeforeDisassembling: calc(var(--loader-part-size) / 4 * -1),
    calc(var(--loader-part-size) / 4 * -1);
  top: var(--loader-part-size);
  left: 0;
}
.loader span:nth-child(3) {
  --translationValue: calc(var(--loader-part-size) / 4 * -1),
    calc(var(--loader-part-size) / 4);
  --translationValueWhenAssebled: 0px, var(--loader-part-size);
  --translationBeforeDisassembling: calc(var(--loader-part-size) / 4),
    calc(var(--loader-part-size) / 4);
  top: var(--loader-part-size);
  right: 0;
  -webkit-animation-delay: 0s, 0.4s;
          animation-delay: 0s, 0.4s;
}
.loader span:nth-child(4) {
  --translationValue: calc(var(--loader-part-size) / 4 * -1),
    calc(var(--loader-part-size) / 4 * -1);
  --translationValueWhenAssebled: calc(var(--loader-part-size) * -1), 0px;
  --translationBeforeDisassembling: calc(var(--loader-part-size) / 4 * -1),
    calc(var(--loader-part-size) / 4);
  bottom: 0;
  left: var(--loader-part-size);
  -webkit-animation-delay: 0s, 0.6s;
          animation-delay: 0s, 0.6s;
}

@-webkit-keyframes fading {
  0% {
    opacity: 1;
  }
  8% {
    opacity: 0.2;
  }
  16.6%, 33.2% {
    opacity: 1;
  }
  41.6% {
    opacity: 0.2;
  }
  50%, 66.6% {
    opacity: 1;
  }
  74.9% {
    opacity: 0.2;
  }
  83.2%, 100% {
    opacity: 1;
  }
}

@keyframes fading {
  0% {
    opacity: 1;
  }
  8% {
    opacity: 0.2;
  }
  16.6%, 33.2% {
    opacity: 1;
  }
  41.6% {
    opacity: 0.2;
  }
  50%, 66.6% {
    opacity: 1;
  }
  74.9% {
    opacity: 0.2;
  }
  83.2%, 100% {
    opacity: 1;
  }
}
@-webkit-keyframes main {
  0%, 25% {
    transform: rotate(0) translate(0, 0);
  }
  33.3%, 58.3% {
    transform: rotate(45deg) translate(var(--translationValue));
  }
  62.45% {
    transform: rotate(90deg) translate(var(--translationValueWhenAssebled));
  }
  66.6%, 91.6% {
    transform: rotate(135deg) translate(var(--translationBeforeDisassembling));
  }
  100% {
    transform: rotate(180deg) translate(0, 0);
  }
}
@keyframes main {
  0%, 25% {
    transform: rotate(0) translate(0, 0);
  }
  33.3%, 58.3% {
    transform: rotate(45deg) translate(var(--translationValue));
  }
  62.45% {
    transform: rotate(90deg) translate(var(--translationValueWhenAssebled));
  }
  66.6%, 91.6% {
    transform: rotate(135deg) translate(var(--translationBeforeDisassembling));
  }
  100% {
    transform: rotate(180deg) translate(0, 0);
  }
}
.help-list li {
  margin-bottom: 5px;
}
.help {
  cursor: pointer;
  position: absolute;
  top: 50px;
  right: 50px;
  color: white;
}
*.hidden {
  display: none !important;
}

div.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 16, 16, 1);
  z-index: 999;
}

@-webkit-keyframes uil-ring-anim {
  0% {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes uil-ring-anim {
  0% {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-moz-keyframes uil-ring-anim {
  0% {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-ms-keyframes uil-ring-anim {
  0% {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-moz-keyframes uil-ring-anim {
  0% {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes uil-ring-anim {
  0% {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-o-keyframes uil-ring-anim {
  0% {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes uil-ring-anim {
  0% {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.uil-ring-css {
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 200px;
  height: 200px;
}
.uil-ring-css > div {
  position: absolute;
  display: block;
  width: 160px;
  height: 160px;
  top: 20px;
  left: 20px;
  border-radius: 80px;
  box-shadow: 0 6px 0 0 #ffffff;
  -ms-animation: uil-ring-anim 1s linear infinite;
  -moz-animation: uil-ring-anim 1s linear infinite;
  -webkit-animation: uil-ring-anim 1s linear infinite;
  -o-animation: uil-ring-anim 1s linear infinite;
  animation: uil-ring-anim 1s linear infinite;
}
.logo {
  margin-top: 9px;
}
._98436 {
  cursor: pointer !important;
}
.copyTo {
  cursor: pointer;
}
.no-data {
  color: white;
  padding: 30px;
  justify-content: center;
}

.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 50%; /* Could be more or less, depending on screen size */
}

.modal-content h1 {
  font-size: 23px;
}

.modal-content h2 {
  font-size: 17px;
}

/* The Close Button */
.close {
  color: black;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
