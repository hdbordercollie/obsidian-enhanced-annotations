<script lang="ts">
    import { l } from '../../../../../../lang/lang';
    import { LabelSettings, StyleScope } from 'src/settings/settings-type';
    import { Notice } from 'obsidian';
    import LabeledAnnotations from '../../../../../../main';
    import AdditionalStyles from './additional-styles.svelte';
    import { onDestroy } from 'svelte';
    import MultiOptionsToggleButton from './multi-option-toggle-button.svelte';
    import { isValidLabel } from '../../../../../../editor-suggest/helpers/is-valid-label';

    export let label: LabelSettings;
    export let plugin: LabeledAnnotations;

    let notice: Notice | null = null;
    let valid = true;
    let previousMessage = '';
    let previousMessageTs = 0;
    let isEmpty = true;

    const onLabelInput = (e: any) => {
        const value = e.target.value;
        isEmpty = value.length === 0;
        valid = isValidLabel(value);
        if (!valid) {
            let message = '';
            if (value === '/') message = "A label should not be equal to '/'";
            else if (value.contains(':'))
                message = "A label should not contain ':'";
            else if (value.contains(' '))
                message = 'A label should not contain spaces';
            if (
                message &&
                (message !== previousMessage ||
                    Date.now() - previousMessageTs > 10000)
            ) {
                if (notice) notice.hide();
                previousMessage = message;
                previousMessageTs = Date.now();
                notice = new Notice(message, 10000);
            }
        } else {
            if (notice) notice.hide();
        }
    };
    const onLabelChange = (e: any) => {
        const value = e.target.value;
        valid = isValidLabel(value);
        if (valid) {
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
        class={!valid && !isEmpty ? 'invalid-label' : ''}
        on:change={onLabelChange}
        on:input={onLabelInput}
        pattern={'[^:\\s]'}
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
    .invalid-label {
        outline: var(--color-red) 2px solid;
    }
</style>
