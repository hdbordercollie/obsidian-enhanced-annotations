<script lang="ts">
	import Styles from './styles.svelte';
	import LabeledAnnotations from '../../../../../../main';
	import NewStyle from './new-style.svelte';
	import { onDestroy } from 'svelte';
	import { Settings } from '../../../../../../settings/settings-type';

	export let plugin: LabeledAnnotations;

    const getAndSortLabels = (settings: Settings) =>
        Object.values(settings.decoration.styles.labels).sort((a, b) =>
            a.label === b.label
                ? b.id.localeCompare(a.id)
                : a.label.localeCompare(b.label),
        );
    let labels = getAndSortLabels(plugin.settings.getValue());
    const unsub = plugin.settings.subscribe((v) => {
        labels = getAndSortLabels(v);
    });
    onDestroy(unsub);
</script>

<div class="styles-list">
    <NewStyle {plugin} />
    {#each labels as label (label.id)}
        <Styles {plugin} {label} />
    {/each}
</div>

<style>
    .styles-list {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        align-items: center;
        padding: 10px 0;
        overflow-y: auto;
    }
</style>
