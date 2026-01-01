import React from 'react';

const styles = {
  container: {
    padding: '50px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    lineHeight: '1.7',
    color: '#24292e',
    backgroundColor: '#fdfdfd',
    maxWidth: '800px',
    margin: '20px auto',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  h1: {
    fontSize: '2.8em',
    color: '#000',
    borderBottom: '2px solid #e1e4e8',
    paddingBottom: '15px',
    marginBottom: '25px',
  },
  h2: {
    fontSize: '2.2em',
    color: '#000',
    marginTop: '50px',
    marginBottom: '25px',
    borderBottom: '1px solid #e1e4e8',
    paddingBottom: '15px',
  },
  h3: {
    fontSize: '1.6em',
    color: '#000',
    marginTop: '40px',
    marginBottom: '20px',
  },
  p: {
    marginBottom: '20px',
  },
  pre: {
    backgroundColor: '#f1f1f1',
    padding: '20px',
    borderRadius: '8px',
    overflow: 'auto',
    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: '0.9em',
  },
  ul: {
    paddingLeft: '25px',
    marginBottom: '20px',
  },
  li: {
    marginBottom: '8px',
  },
  strong: {
    fontWeight: 'bold',
  },
  a: {
    color: '#005cc5',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  hr: {
      border: 0,
      height: '1px',
      backgroundColor: '#d1d5da',
      margin: '50px 0'
  }
};

const LicensePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>JobTrac Open Core License</h1>
      <p style={styles.p}>
        <strong style={styles.strong}>Version 1.0, January 2026</strong>
      </p>
      <p style={styles.p}>Copyright (c) 2026 Hariharen</p>

      <h2 style={styles.h2}>Open Source Core Components</h2>
      <p style={styles.p}>
        The following components of JobTrac are licensed under the <strong style={styles.strong}>MIT License</strong>:
      </p>

      <h3 style={styles.h3}>Core Features (MIT Licensed)</h3>
      <ul style={styles.ul}>
        <li style={styles.li}>Job application tracking system</li>
        <li style={styles.li}>Interview preparation tools (prep log, STAR stories)</li>
        <li style={styles.li}>Company research management</li>
        <li style={styles.li}>Networking contact system</li>
        <li style={styles.li}>Basic analytics dashboard</li>
        <li style={styles.li}>Notes system with markdown support</li>
        <li style={styles.li}>User authentication and data management</li>
        <li style={styles.li}>Theme system (light/dark/amoled)</li>
        <li style={styles.li}>Mobile-responsive interface</li>
        <li style={styles.li}>Keyboard shortcuts and navigation</li>
        <li style={styles.li}>Command palette functionality</li>
        <li style={styles.li}>Search capabilities</li>
      </ul>

      <h3 style={styles.h3}>MIT License</h3>
      <pre style={styles.pre}>{`Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</pre>

      <hr style={styles.hr} />

      <h2 style={styles.h2}>Commercial Cloud Service Components</h2>
      <p style={styles.p}>
        The following features are proprietary and available only through <strong style={styles.strong}>Jobtrac Pro</strong> (jobtrac.site):
      </p>

      <h3 style={styles.h3}>Premium Cloud Features (Proprietary)</h3>
      <ul style={styles.ul}>
        <li style={styles.li}>Advanced analytics with AI-powered insights</li>
        <li style={styles.li}>Automated email reminders and follow-up systems</li>
        <li style={styles.li}>Team collaboration and multi-user workspaces</li>
        <li style={styles.li}>Advanced data export capabilities (PDF reports, custom formats)</li>
        <li style={styles.li}>Integration APIs and webhooks</li>
        <li style={styles.li}>Priority customer support</li>
        <li style={styles.li}>Mobile applications (iOS/Android)</li>
        <li style={styles.li}>Advanced goal tracking with predictive analytics</li>
        <li style={styles.li}>Bulk operations and data management tools</li>
        <li style={styles.li}>Custom branding and white-label options</li>
      </ul>

      <h3 style={styles.h3}>Terms for Commercial Use</h3>
        <ol style={{...styles.ul, listStyleType: 'decimal'}}>
            <li style={styles.li}><strong style={styles.strong}>Personal Use</strong>: Free to use JobTrac core features for personal job searching</li>
            <li style={styles.li}><strong style={styles.strong}>Commercial Use</strong>: Organizations using JobTrac for commercial purposes (career coaching, recruitment agencies, educational institutions with &gt;100 students) must use Jobtrac Pro or obtain a commercial license</li>
            <li style={styles.li}><strong style={styles.strong}>Self-Hosting</strong>: Permitted for personal use and small organizations (&lt;100 users)</li>
            <li style={styles.li}><strong style={styles.strong}>Modification</strong>: You may modify the open source components under MIT license terms</li>
            <li style={styles.li}><strong style={styles.strong}>Distribution</strong>: You may distribute the open source components, but not the proprietary cloud features</li>
        </ol>

        <h3 style={styles.h3}>Commercial License Pricing</h3>
        <ul style={styles.ul}>
            <li style={styles.li}><strong style={styles.strong}>Small Business License</strong> (1-50 users): $199/year</li>
            <li style={styles.li}><strong style={styles.strong}>Enterprise License</strong> (51+ users): Contact for pricing</li>
            <li style={styles.li}><strong style={styles.strong}>White Label License</strong>: Contact for pricing</li>
        </ul>

        <hr style={styles.hr} />

        <h2 style={styles.h2}>Self-Hosting Guidelines</h2>
        <h3 style={styles.h3}>Permitted Self-Hosting Uses</h3>
        <ul style={styles.ul}>
            <li style={styles.li}>✅ Personal job search tracking</li>
            <li style={styles.li}>✅ Small team use (&lt;10 people)</li>
            <li style={styles.li}>✅ Educational purposes</li>
            <li style={styles.li}>✅ Non-profit organizations</li>
            <li style={styles.li}>✅ Development and testing</li>
        </ul>

        <h3 style={styles.h3}>Commercial Self-Hosting Requirements</h3>
        <p style={styles.p}>For organizations using JobTrac commercially, you must either:</p>
        <ul style={styles.ul}>
            <li style={styles.li}>Use Jobtrac Pro (jobtrac.site)</li>
            <li style={styles.li}>Purchase a Commercial Self-Hosting License</li>
            <li style={styles.li}>Contribute back to the open source project (minimum 40 hours development time annually)</li>
        </ul>

        <hr style={styles.hr} />

        <h2 style={styles.h2}>Contributing Guidelines</h2>
        <h3 style={styles.h3}>Open Source Contributions</h3>
        <p style={styles.p}>All contributions to the core open source components will be licensed under MIT and may be incorporated into both the open source and commercial versions.</p>
        <p style={styles.p}>By contributing, you agree that:</p>
        <ul style={styles.ul}>
            <li style={styles.li}>Your contributions will be MIT licensed</li>
            <li style={styles.li}>JobTrac may incorporate your contributions into commercial offerings</li>
            <li style={styles.li}>You retain copyright to your original contributions</li>
            <li style={styles.li}>You grant JobTrac perpetual rights to use contributions in all versions</li>
        </ul>

        <h3 style={styles.h3}>Contributor Recognition</h3>
        <ul style={styles.ul}>
            <li style={styles.li}>All contributors are recognized in CONTRIBUTORS.md</li>
            <li style={styles.li}>Significant contributors receive free Jobtrac Pro Pro accounts</li>
            <li style={styles.li}>Major feature contributors may receive revenue sharing opportunities</li>
        </ul>

        <hr style={styles.hr} />

        <h2 style={styles.h2}>Support and Community</h2>
        <h3 style={styles.h3}>Community Support (Free)</h3>
        <ul style={styles.ul}>
            <li style={styles.li}>GitHub Issues for bug reports</li>
            <li style={styles.li}>GitHub Discussions for questions and feature requests</li>
            <li style={styles.li}>Community Discord server</li>
            <li style={styles.li}>Documentation wiki</li>
        </ul>

        <h3 style={styles.h3}>Premium Support (Jobtrac Pro)</h3>
        <ul style={styles.ul}>
            <li style={styles.li}>Email support with SLA</li>
            <li style={styles.li}>Video call support for enterprise customers</li>
            <li style={styles.li}>Custom feature development</li>
            <li style={styles.li}>Migration assistance</li>
        </ul>

        <hr style={styles.hr} />

        <h2 style={styles.h2}>Compliance and Legal</h2>
        <h3 style={styles.h3}>Data Privacy</h3>
        <ul style={styles.ul}>
            <li style={styles.li}>JobTrac complies with GDPR and CCPA</li>
            <li style={styles.li}>Self-hosted versions: You are responsible for data compliance</li>
            <li style={styles.li}>Jobtrac Pro: We handle compliance for you</li>
        </ul>

        <h3 style={styles.h3}>Third-Party Components</h3>
        <p style={styles.p}>JobTrac includes third-party open source components, each under their respective licenses:</p>
        <ul style={styles.ul}>
            <li style={styles.li}>React (MIT)</li>
            <li style={styles.li}>Firebase SDK (Apache 2.0)</li>
            <li style={styles.li}>Tailwind CSS (MIT)</li>
            <li style={styles.li}>See package.json for complete list</li>
        </ul>

        <hr style={styles.hr} />

        <h2 style={styles.h2}>Contact Information</h2>

        <h3 style={styles.h3}>For Open Source Questions:</h3>
        <ul style={styles.ul}>
            <li style={styles.li}><a href="https://github.com/hariharen9/jobtrac/issues" style={styles.a}>GitHub Issues</a></li>
            <li style={styles.li}><a href="https://github.com/hariharen9/jobtrac/discussions" style={styles.a}>GitHub Discussions</a></li>
        </ul>

        <h3 style={styles.h3}>For General Inquiries:</h3>
        <p style={styles.p}><a href="https://jobtrac.site" style={styles.a}>https://jobtrac.site</a></p>

        <hr style={styles.hr} />

        <h2 style={styles.h2}>License Updates</h2>
        <p style={styles.p}>This license may be updated from time to time. Updates will be posted at:</p>
        <ul style={styles.ul}>
            <li style={styles.li}><a href="https://github.com/hariharen9/jobtrac/blob/main/LICENSE.md" style={styles.a}>https://github.com/hariharen9/jobtrac/blob/main/LICENSE.md</a></li>
            <li style={styles.li}><a href="https://jobtrac.site/license" style={styles.a}>https://jobtrac.site/license</a></li>
        </ul>

        <hr style={styles.hr} />

        <p style={{...styles.p, fontStyle: 'italic', textAlign: 'center'}}>Last updated: August 31, 2025</p>
        <p style={{...styles.p, fontStyle: 'italic', textAlign: 'center'}}><strong style={styles.strong}>JobTrac - Empowering careers, one application at a time.</strong></p>
    </div>
  );
};

export default LicensePage;
