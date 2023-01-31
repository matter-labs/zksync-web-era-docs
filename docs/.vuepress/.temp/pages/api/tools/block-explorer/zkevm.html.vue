<template><div><h2 id="using-zkevm-debugger" tabindex="-1"><a class="header-anchor" href="#using-zkevm-debugger" aria-hidden="true">#</a> Using zkEVM debugger</h2>
<TocHeader /><TOC class="table-of-contents" :include-level="[2,3]" /><h3 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h3>
<p>The disadvantage of contract execution is that it is difficult to determine what a transaction did. A transaction receipt has a status code that indicates whether or not the execution was successful, but there is no way to determine what data was updated or which external contracts were triggered. This is remedied by zkSync zkEVM debugger, which replays the execution of your smart contracts and captures data on exactly what the EVM did, allowing you to examine each instruction.</p>
<p>The <a href="https://explorer.zksync.io/tools/debugger" target="_blank" rel="noopener noreferrer">debugger page<ExternalLinkIcon/></a> can be accessed from the top menu.</p>
<figure><img src="@source/assets/images/zk-evm.png" alt="zkEVM!" tabindex="0" loading="lazy"><figcaption>zkEVM page</figcaption></figure>
<h3 id="debugging-steps" tabindex="-1"><a class="header-anchor" href="#debugging-steps" aria-hidden="true">#</a> Debugging steps</h3>
<p>Here are the steps to follow to debug or trace a transaction:</p>
<ol>
<li>Upload a JSON file:  Click on the <code v-pre>Upload JSON file</code> button and you will see a modal window with a saving prompt, or simply drag-and-drop the file into the upload dialog. To know the specification of the type of file, please read the <a href="https://eips.ethereum.org/EIPS/eip-3155" target="_blank" rel="noopener noreferrer">EVM trace specification<ExternalLinkIcon/></a>.</li>
<li>File upload: A loader screen is shown to indicate that the trace file is loading.</li>
<li>At a successful upload the debugger state changes to an active state.</li>
<li>To proceed to debug, click on the <code v-pre>Start</code> button.</li>
</ol>
<p>These are some <strong>keyboard shortcuts</strong> to note when debugging.</p>
<ul>
<li><code v-pre>Cmd + K</code>: This opens the search bar.</li>
<li><code v-pre>Arrows Left / Right</code>: This takes you to the next or previous instruction.</li>
<li><code v-pre>Arrows Top / Bottom</code>: It takes you to the next previous function inside of this contract.</li>
<li><code v-pre>Shift + Arrows</code>: It takes you to the next or previous contract</li>
</ul>
</div></template>


