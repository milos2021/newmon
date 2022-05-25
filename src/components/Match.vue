<template>
  <div>
    <!-- <div class="col-md-1 level">
            {{ source.level_betradar.toFixed(2) }}<br />
            {{ source.level_asian.toFixed(2) }}
          </div> -->
    <div
      class="col-md-8 teamNamesHolder"
      v-bind:style="[checkColor(source.level_betradar)]"
    >
      <div class="row">
        <div class="col-md-2 league-and-date">
          <b
            >{{ new Date(source.startDate).getDate() }}.
            {{ months[new Date(source.startDate).getMonth()] }}
          </b>
          <br />
          <span class="kr">{{ days[new Date(source.startDate).getDay()] }}</span
          ><br />
          <b
            >{{ new Date(source.startDate).getHours() }}:{{
              new Date(source.startDate).getMinutes().toString().length == 1
                ? "0" + new Date(source.startDate).getMinutes()
                : new Date(source.startDate).getMinutes()
            }}</b
          >
        </div>
        <div class="col-md-3 col-md-3-half team-names">
          <a
            class="teamLinks teamLiga"
            :title="source.liga"
            v-on:click.stop="
              openUrl(
                'http://10.0.90.252:81/index.php/utakmica/kvoteExpress/action?server=1&liga=' +
                  source.liga,
                'child'
              )
            "
            ><img
              src="../assets/rezalica.png"
              class="mainTeamLinks"
              width="10" />&nbsp;&nbsp;{{ source.liga }}<br
          /></a>
          <a
            class="teamLinks teamName"
            :title="source.homeCompetitorName"
            v-on:click.stop="
              openUrl(
                'https://www.oddsportal.com/search/' + source.homeCompetitorName,
                'child2'
              )
            "
            ><b>{{ source.homeCompetitorName }}</b></a
          ><br />
          <a
            class="teamLinks teamName"
            :title="source.awayCompetitorName"
            v-on:click.stop="
              openUrl(
                'https://www.oddsportal.com/search/' + source.awayCompetitorName,
                'child2'
              )
            "
            ><b>{{ source.awayCompetitorName }}</b></a
          >
        </div>
        <div class="col-md-2 col-md-1-half alignRows">
          <div class="row">
            <div
              class="col-md-12 prod"
              v-bind:style="[
                avoidNull(source.odds['KI 1']['betradar_difference']) < 0
                  ? {
                      color: getDangerColor(),
                      backgroundColor: getDangerBgColor(),
                    }
                  : { color: getColorAccordingToStyle() },
              ]"
            >
              {{ avoidNullAndConvertToFixed(source.odds["KI 1"].production) }}
            </div>
            <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(source.odds["KI 1"].betradar_difference, true, false)}}
                  </div> -->
          </div>
          <div class="row">
            <div class="col-md-6 betradar">
              {{ avoidNullAndConvertToFixed(source.odds["KI 1"].betradar) }}
            </div>
            <div class="col-md-6 feed">
              <!-- {{ avoidNullAndConvertToFixed(source.odds["KI 1"].asian) }} -->/
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
                avoidNull(source.odds['KI X']['betradar_difference']) < 0
                  ? {
                      color: getDangerColor(),
                      backgroundColor: getDangerBgColor(),
                    }
                  : { color: getColorAccordingToStyle() },
              ]"
            >
              {{ avoidNullAndConvertToFixed(source.odds["KI X"].production) }}
            </div>
            <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(source.odds["KI X"].betradar_difference, true, false)}}
                  </div> -->
          </div>
          <div class="row">
            <div class="col-md-6 betradar">
              {{ avoidNullAndConvertToFixed(source.odds["KI X"].betradar) }}
            </div>
            <div class="col-md-6 feed">
              <!-- {{ avoidNullAndConvertToFixed(source.odds["KI X"].asian) }} -->/
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
                avoidNull(source.odds['KI 2']['betradar_difference']) < 0
                  ? {
                      color: getDangerColor(),
                      backgroundColor: getDangerBgColor(),
                    }
                  : { color: getColorAccordingToStyle() },
              ]"
            >
              {{ avoidNullAndConvertToFixed(source.odds["KI 2"].production) }}
            </div>
            <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(source.odds["KI 2"].betradar_difference, true, false)}}
                  </div> -->
          </div>
          <div class="row">
            <div class="col-md-6 betradar">
              {{ avoidNullAndConvertToFixed(source.odds["KI 2"].betradar) }}
            </div>
            <div class="col-md-6 feed">
              <!-- {{ avoidNullAndConvertToFixed(source.odds["KI 2"].asian) }} -->/
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
              {{ calculatePayout(source.odds, "1x2") }}
            </div>
          </div>
          <div class="row mtop25">
            <div class="col-md-12">
              <select
                class="suggestionsList"
                v-model="source.closest1x2Payout"
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
                avoidNull(source.odds['UG 0-2']['betradar_difference']) < 0
                  ? {
                      color: getDangerColor(),
                      backgroundColor: getDangerBgColor(),
                    }
                  : { color: getColorAccordingToStyle() },
              ]"
            >
              {{ avoidNullAndConvertToFixed(source.odds["UG 0-2"].production) }}
            </div>
            <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(source.odds["UG 0-2"].betradar_difference, true, false)}}
                  </div> -->
          </div>
          <div class="row">
            <div class="col-md-6 betradar">
              {{ avoidNullAndConvertToFixed(source.odds["UG 0-2"].betradar) }}
            </div>
            <div class="col-md-6 feed">
              <!-- {{ avoidNullAndConvertToFixed(source.odds["UG 0-2"].asian) }} -->/
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
                avoidNull(source.odds['UG 3+']['betradar_difference']) < 0
                  ? {
                      color: getDangerColor(),
                      backgroundColor: getDangerBgColor(),
                    }
                  : { color: getColorAccordingToStyle() },
              ]"
            >
              {{ avoidNullAndConvertToFixed(source.odds["UG 3+"].production) }}
            </div>
            <!-- <div class="col-md-6 real">
                    {{avoidNullAndConvertToFixed(source.odds["UG 3+"].betradar_difference, true, false)}}
                  </div> -->
          </div>
          <div class="row">
            <div class="col-md-6 betradar">
              {{ avoidNullAndConvertToFixed(source.odds["UG 3+"].betradar) }}
            </div>
            <div class="col-md-6 feed">
              <!-- {{ avoidNullAndConvertToFixed(source.odds["UG 3+"].asian) }} -->/
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
              {{ calculatePayout(source.odds, "goals") }}
            </div>
          </div>
          <div class="row mtop25">
            <div class="col-md-12">
              {{ calculateObaranjePayout(item) }}
            </div>
          </div>
        </div>
        <div class="col-md-2 plus">
          <i class="fa fa-plus" v-on:click.stop="showMoreOdds(source.Code)"></i>
          <span class="badOdds">{{
            avoidNull(source.num_outcomes_betradar)
          }}</span
          ><br />
          <span class="badOdds">N/A</span>
          <span class="badOdds removeMatch"
            ><i class="fa fa-remove" v-on:click.stop="hideMatch(source.Code)"></i
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      // index of current item
      type: Number,
    },
    source: {
      // here is: {uid: 'unique_1', text: 'abc'}
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style>
</style>