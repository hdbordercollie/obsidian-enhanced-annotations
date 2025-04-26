import { Setting } from 'obsidian';
import LabeledAnnotations from '../../../main';
import { DEFAULT_SETTINGS } from '../../default-settings';
import { l } from '../../../lang/lang';
import { settingsHeader } from '../../../status-bar/helpers/class-names';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};
export const TTSSettings = ({ plugin, containerEl }: Props) => {
    const render = () => {
        containerEl.empty();
        TTSSettings({
            plugin,
            containerEl,
        });
    };
    new Setting(containerEl)
        .setName(l.SETTINGS_TTS_TITLE)
        .setHeading()
        .settingEl.addClass(settingsHeader);
    new Setting(containerEl)
        .addDropdown((component) => {
            const voices = window.speechSynthesis
                .getVoices()
                .map((v) => [v.name, v.name]);
            component.addOptions(Object.fromEntries(voices));
            component.onChange((v) => {
                plugin.settings.dispatch({
                    type: 'SET_TTS_VOICE',
                    payload: {
                        voice: v,
                    },
                });
            });
        })
        .setName(l.SETTINGS_TTS_VOICE);
    new Setting(containerEl)
        .setName(l.SETTINGS_TTS_VOLUME)
        .addSlider((component) =>
            component
                .setDynamicTooltip()
                .setLimits(0, 100, 1)
                .onChange((value) => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_VOLUME',
                        payload: { volume: value / 100 },
                    });
                }),
        )
        .addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip(l.SETTINGS_TTS_RESTORE_DEFAULTS)
                .onClick(() => {
                    render();
                });
        });

    new Setting(containerEl)
        .setName(l.SETTINGS_TTS_RATE)
        .addSlider((slider) => {
            slider
                .setDynamicTooltip()
                .setLimits(0.1, 10, 0.1)
                .onChange((value) => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_RATE',
                        payload: { rate: value },
                    });
                });
        })
        .addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip(l.SETTINGS_TTS_RESTORE_DEFAULTS)
                .onClick(() => {
                    render();
                });
        });

    new Setting(containerEl)
        .setName(l.SETTINGS_TTS_PITCH)
        .addSlider((slider) => {
            slider
                .setDynamicTooltip()
                .setLimits(0, 2, 0.1)
                .onChange((value) => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_PITCH',
                        payload: { pitch: value },
                    });
                });
        })
        .addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip(l.SETTINGS_TTS_RESTORE_DEFAULTS)
                .onClick(() => {
                    render();
                });
        });
    new Setting(containerEl)
        .addToggle((c) => {
            c.onChange((v) => {
                plugin.settings.dispatch({
                    type: 'SET_TTS_FOCUS_COMMENT_IN_EDITOR',
                    payload: { enable: v },
                });
            });
        })
        .setName(l.SETTINGS_TTS_FOCUS_ANNOTATION_IN_EDITOR)
        .setDesc(l.SETTINGS_TTS_FOCUS_ANNOTATION_IN_EDITOR_DESC);
};
