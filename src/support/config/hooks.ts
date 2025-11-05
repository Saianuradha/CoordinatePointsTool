import { Before, BeforeAll, AfterAll, After, setDefaultTimeout, ITestCaseHookParameter, Status, formatterHelpers } from "@cucumber/cucumber";
import { Browser } from "@playwright/test";
import WebBrowser from "../manager/Browser";
import fse from "fs-extra";
import UIActions from "../playwright/actions/UIActions";
import Log from "../logger/Log";

const timeInMin: number = 60 * 1000;
const testTimeout = process.env.TEST_TIMEOUT ? Number.parseInt(process.env.TEST_TIMEOUT, 10) * timeInMin : 5 * timeInMin; // Default to 5 minutes if TEST_TIMEOUT is not set
setDefaultTimeout(testTimeout);

let browser: Browser;

// Launch the browser
BeforeAll(async function () {
    Log.info('🚀 Starting test suite...');
    Log.info('⏰ Timestamp: ' + new Date().toISOString());
    browser = await WebBrowser.launch();
    Log.info('✅ Browser launched successfully');
});

// Close the browser
AfterAll(async function () {
    Log.info('\n' + '='.repeat(80));
    Log.info('🏁 Test suite completed');
    Log.info('⏰ Timestamp: ' + new Date().toISOString());
    await browser.close();
    Log.info('✅ Browser closed');
    Log.info('='.repeat(80) + '\n');
});

// Create a new browser context and page per scenario
Before(async function ({ pickle, gherkinDocument }: ITestCaseHookParameter) {
    const { line } = formatterHelpers.PickleParser.getPickleLocation({ gherkinDocument, pickle });
    
    Log.info('\n' + '='.repeat(80));
    Log.info(`📝 Scenario: ${pickle.name}`);
    Log.info(`📂 Feature: ${gherkinDocument.feature?.name}`);
    Log.info(`🏷️  Tags: ${pickle.tags.map(t => t.name).join(', ')}`);
    Log.info(`📍 Line: ${line}`);
    Log.info('='.repeat(80));
    
    Log.testBegin(`${pickle.name}: ${line}`);
    
    this.context = await browser.newContext({
        viewport: null,
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        recordVideo: process.env.RECORD_VIDEO === "true" ? { dir: './test-results/videos' } : undefined,
    });
    this.page = await this.context.newPage();
    this.web = new UIActions(this.page);
    
    // Add console message listener for debugging
    if (process.env.DEBUG === 'true') {
        this.page.on('console', (msg: any) => {
            Log.info(`🌐 Browser Console [${msg.type()}]: ${msg.text()}`);
        });
    }
    
    // Add error listener
    this.page.on('pageerror', (error: Error) => {
        Log.error('❌ Page Error: ' + error.message);
    });
    
    Log.info('✅ Browser context and page created');
});

// ============================================================
// CUSTOM HOOKS FOR TAGGED SCENARIOS - BEFORE
// ============================================================

// Hook for scenarios tagged with @bug
Before({ tags: '@bug' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.error('⚠️  KNOWN BUG: This scenario is expected to fail');
    Log.error(`⚠️  Bug Scenario: ${pickle.name}`);
    Log.error('⚠️  Test will run for regression tracking purposes');
});

// Hook for scenarios tagged with @critical
Before({ tags: '@critical' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.info('🔥 CRITICAL TEST: Failure will block deployment');
    Log.info(`🔥 Critical Scenario: ${pickle.name}`);
    Log.info('🔥 This test must pass for release approval');
});

// Hook for scenarios tagged with @smoke
Before({ tags: '@smoke' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.info('💨 SMOKE TEST: Core functionality check');
    Log.info(`💨 Smoke Scenario: ${pickle.name}`);
    Log.info('💨 Quick validation of essential features');
});

// Hook for scenarios tagged with @regression
Before({ tags: '@regression' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.info('🔄 REGRESSION TEST: Verifying existing functionality');
    Log.info(`🔄 Regression Scenario: ${pickle.name}`);
});

// Hook for scenarios tagged with @validation
Before({ tags: '@validation' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.info('✔️  VALIDATION TEST: Input validation check');
    Log.info(`✔️  Validation Scenario: ${pickle.name}`);
});

// Hook for scenarios tagged with @calculation
Before({ tags: '@calculation' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.info('🔢 CALCULATION TEST: Mathematical accuracy check');
    Log.info(`🔢 Calculation Scenario: ${pickle.name}`);
});

// Hook for scenarios tagged with @edge-case
Before({ tags: '@edge-case' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.info('🎯 EDGE CASE TEST: Testing boundary conditions');
    Log.info(`🎯 Edge Case Scenario: ${pickle.name}`);
});

// Hook for scenarios tagged with @ui
Before({ tags: '@ui' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.info('🎨 UI TEST: User interface behavior check');
    Log.info(`🎨 UI Scenario: ${pickle.name}`);
});

// Hook for slow tests (extended timeout)
Before({ tags: '@slow' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.info('🐌 SLOW TEST: Extended timeout applied');
    Log.info(`🐌 Slow Scenario: ${pickle.name}`);
    setDefaultTimeout(120000); // 2 minutes for slow tests
});

// Hook for scenarios tagged with @wip (Work In Progress)
Before({ tags: '@wip' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.error('🚧 WIP: Work in progress test');
    Log.error(`🚧 WIP Scenario: ${pickle.name}`);
    Log.error('🚧 Test may be unstable or incomplete');
});

// Hook for scenarios tagged with @skip
Before({ tags: '@skip' }, async function ({ pickle }: ITestCaseHookParameter) {
    Log.error('⏭️  SKIP: This scenario is being skipped');
    Log.error(`⏭️  Skipped Scenario: ${pickle.name}`);
    return 'skipped';
});

// ============================================================
// CUSTOM HOOKS FOR TAGGED SCENARIOS - AFTER
// ============================================================

// After hook for @bug tagged scenarios
After({ tags: '@bug' }, async function ({ result, pickle }: ITestCaseHookParameter) {
    const status = result?.status ?? 'UNDEFINED';
    
    if (status === Status.FAILED) {
        Log.error('⚠️  Known bug confirmed - Test failed as expected');
        Log.error(`⚠️  Bug Scenario: ${pickle.name} - Status: ${status}`);
    } else if (status === Status.PASSED) {
        Log.info('✅ Bug appears to be FIXED! Test passed unexpectedly');
        Log.info(`✅ Previously failing scenario: ${pickle.name}`);
        Log.info('✅ Please verify bug fix and remove @bug tag if resolved');
    }
});

// After hook for @critical tagged scenarios
After({ tags: '@critical' }, async function ({ result, pickle }: ITestCaseHookParameter) {
    const status = result?.status ?? 'UNDEFINED';
    
    if (status === Status.FAILED) {
        Log.error('❌ CRITICAL TEST FAILED - BLOCKING DEPLOYMENT');
        Log.error(`❌ Failed Critical Scenario: ${pickle.name}`);
        Log.error('❌ Action Required: Fix immediately before release');
    } else if (status === Status.PASSED) {
        Log.info('✅ Critical test passed - Safe to proceed');
    }
});

// After hook for @smoke tagged scenarios
After({ tags: '@smoke' }, async function ({ result, pickle }: ITestCaseHookParameter) {
    const status = result?.status ?? 'UNDEFINED';
    
    if (status === Status.FAILED) {
        Log.error('❌ SMOKE TEST FAILED - Core functionality broken');
        Log.error(`❌ Failed Smoke Scenario: ${pickle.name}`);
    } else if (status === Status.PASSED) {
        Log.info('✅ Smoke test passed - Core functionality working');
    }
});

// ============================================================
// MAIN CLEANUP AFTER EACH SCENARIO
// ============================================================

// Cleanup after each scenario
After(async function ({ result, pickle, gherkinDocument }: ITestCaseHookParameter) {
    const { line } = formatterHelpers.PickleParser.getPickleLocation({ gherkinDocument, pickle });
    const status = result?.status ?? 'UNDEFINED'; // Provide a default status if undefined
    const scenario = pickle.name;
    const videoPath = await this.page.video()?.path();

    Log.info('\n' + '-'.repeat(80));
    Log.info(`📊 Scenario Result: ${status.toUpperCase()}`);
    
    if (status === Status.FAILED) {
        Log.error(`❌ FAILED: ${scenario}`);
        
        // Take screenshot on failure
        const screenshotPath = `./test-results/screenshots/${scenario.replace(/\s+/g, '_')} (${line}).png`;
        const image = await this.page.screenshot({ 
            path: screenshotPath, 
            fullPage: true 
        });
        await this.attach(image, 'image/png');
        Log.info('📸 Screenshot captured: ' + screenshotPath);
        
        // Capture page HTML for debugging
        const html = await this.page.content();
        await this.attach(html, 'text/html');
        Log.info('📄 Page HTML captured');
        
        // Log current URL
        Log.info('🌐 Current URL: ' + this.page.url());
        
        // Log error details
        Log.error(`${scenario}: ${line} - ${status}\n${result?.message}`);
    } else if (status === Status.PASSED) {
        Log.info(`✅ PASSED: ${scenario}`);
    } else if (status === Status.SKIPPED) {
        Log.error(`⏭️  SKIPPED: ${scenario}`);
    } else if (status === Status.PENDING) {
        Log.error(`⏳ PENDING: ${scenario}`);
    } else if (status === Status.UNDEFINED) {
        Log.error(`❓ UNDEFINED: ${scenario}`);
    }
    
    // Log duration if available
    if (result?.duration) {
        const durationInSeconds = result.duration.seconds || 0;
        const durationInMs = result.duration.nanos ? result.duration.nanos / 1000000 : 0;
        const totalDuration = durationInSeconds + (durationInMs / 1000);
        Log.info(`⏱️  Duration: ${totalDuration.toFixed(2)} seconds`);
    }
    
    Log.info('-'.repeat(80) + '\n');

    // Close page and context
    await this.page.close();
    await this.context.close();
    Log.info('🧹 Cleaned up browser context');

    // Handle video recording
    if (process.env.RECORD_VIDEO === "true" && videoPath) {
        if (status === Status.FAILED) {
            const newVideoPath = `./test-results/videos/${scenario.replace(/\s+/g, '_')}(${line}).webm`;
            await fse.rename(videoPath, newVideoPath);
            await this.attach(fse.readFileSync(newVideoPath), 'video/webm');
            Log.info('🎥 Video saved: ' + newVideoPath);
        } else {
            await fse.unlink(videoPath);
            Log.info('🎥 Video deleted (test passed)');
        }
    }

    Log.testEnd(`${scenario}: ${line}`, status.toString()); // Ensure status is a string
});