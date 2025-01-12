import LabeledAnnotations from '../main';

export const DAYS_UNUSED = 3;
export const pluginIsIdle = (plugin: LabeledAnnotations) =>
    plugin.settings.getValue().idling.daysUnused.length > DAYS_UNUSED;
