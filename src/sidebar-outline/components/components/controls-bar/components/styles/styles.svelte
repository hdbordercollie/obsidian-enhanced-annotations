<script lang="ts">
    import { l } from '../../../../../../lang/lang';
    import { LabelSettings, StyleScope } from 'src/settings/settings-type';
    import { Notice } from 'obsidian';
    import LabeledAnnotations from '../../../../../../main';
    import AdditionalStyles from './additional-styles.svelte';
    import { onDestroy } from 'svelte';
    import MultiOptionsToggleButton from './multi-option-toggle-button.svelte';

    export let label: LabelSettings;
    export let plugin: LabeledAnnotations;

    const onLabelChange = (e: any) => {
        const value = e.target.value;
        const input = e.target;
        input.checkValidity();
        if (input.validity.patternMismatch) {
            input.reportValidity();
            new Notice(l.SETTINGS_LABELS_STYLES_LABEL_INVALID);
        } else {
            plugin.settings.dispatch({
                payload: {
                    pattern: value,
                    id: label.id,
                },
                type: 'SET_PATTERN',
            });
        }
    };
    let showAdditionalSettings = false;
    const onToggleAdditionalSettings = () => {
        showAdditionalSettings = !showAdditionalSettings;
    };

    const cleanupEmptyLabels = () => {
        const labels = plugin.settings.getValue().decoration.styles.labels;
        const stylesWithEmptyLabels = Object.values(labels)
            .flat()
            .filter((v) => !v.label && !v.style.scope)
            .sort((a, b) => Number(a.id) - Number(b.id));
        if (stylesWithEmptyLabels.length > 1) {
            stylesWithEmptyLabels.splice(stylesWithEmptyLabels.length - 1);
            stylesWithEmptyLabels.forEach((v) => {
                plugin.settings.dispatch({
                    type: 'DELETE_GROUP',
                    payload: { id: v.id },
                });
            });
        }
    };
    onDestroy(cleanupEmptyLabels);
    const onScopeChange = (value: StyleScope) =>
        plugin.settings.dispatch({
            type: 'SET_LABEL_SCOPE',
            payload: { id: label.id, scope: value },
        });

    const scopes = [
        {
            iconName: 'comment' as const,
            value: 'comments',
        },
        {
            iconName: 'highlight' as const,
            value: 'highlights',
        },
    ];
</script>

<div class={'main-styles'}>
    <MultiOptionsToggleButton
        props={{
            name: 'Scope',
            options: scopes,
            value: label.style.scope,
            onChange: onScopeChange,
        }}
    />
    <input
        on:change={onLabelChange}
        pattern={'^\\w+$'}
        placeholder={l.SETTINGS_LABELS_STYLES_NAME_PLACE_HOLDER}
        style="width: 75px;"
        type="text"
        value={label.label}
    />
    <AdditionalStyles
        {label}
        {onToggleAdditionalSettings}
        {plugin}
        {showAdditionalSettings}
    />
</div>

<style>
    .main-styles {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
