import type { FunctionalComponent, SVGAttributes } from 'vue';
import { flattenIconsObject } from '../util';
import sidebarIcons from './sidebar';
import userIcons from './user';
import common from './common';
import syllabus from './syllabus';
/**
 * Eg: Using with vuetify:
 * ```
 * <v-button icon="$custom.filter"></v-button>
 * ```
 * NOTE: custom SVG icon must be remove "width" and "height" attributes, change "stroke" value to "currentColor"
 */
const icons = flattenIconsObject({
  custom: common,
  sidebar: sidebarIcons,
  user: userIcons,
  syllabus,
}) as Record<string, FunctionalComponent<SVGAttributes>>;
export default icons;
