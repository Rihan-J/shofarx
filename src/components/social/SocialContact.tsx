'use client';

import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaPhoneAlt, FaEnvelope, FaCommentDots } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { Reveal } from '../Reveal';
import { useSocialLinks } from '../../hooks/useApi';

export function SocialContact() {
  const { data: socialLinks = [] } = useSocialLinks();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          service_type: 'social',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        let errMsg = data.error;
        if (typeof errMsg === 'object' && errMsg?.fieldErrors) {
          const firstField = Object.keys(errMsg.fieldErrors)[0];
          errMsg = errMsg.fieldErrors[firstField]?.[0] || 'Validation error';
        }
        throw new Error(typeof errMsg === 'string' ? errMsg : `Server error: ${res.status}`);
      }

      const SERVICE_ID = 'service_w0a58k3';
      const TEMPLATE_ID = 'template_sf7opcs';
      const PUBLIC_KEY = 'TpDOxZXKJTeyMyBFs';

      emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
          service_type: 'social',
        },
        PUBLIC_KEY
      ).catch(() => {});

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="w-section sc" aria-label="Contact">
      <div className="w-section__inner sc__inner">
        <div className="sc__left">
          <Reveal>
            <p className="w-section__eyebrow">Get in Touch</p>
            <h2 className="w-section__heading wc__heading-premium">
              Let's grow
              <br />
              <span className="sc__heading-em">your brand.</span>
            </h2>
            <p className="sc__sub">
              Tell us about your brand. We'll get back to you within 24 hours.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="sc__promises">
              {['Free initial consultation', 'Custom strategy within 48h'].map((p) => (
                <div key={p} className="sc__promise">
                  <span className="sc__promise-check" aria-hidden="true">✓</span>
                  {p}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="sc__right">
          <Reveal delay={0.1}>
            {status === 'success' ? (
              <div className="sc__form sc__success" role="status">
                <CheckCircle size={48} color="var(--accent-primary)" />
                <h3 className="wc__success-title">Message Sent!</h3>
                <p className="wc__success-sub">We'll get back to you within 24 hours.</p>
                <button
                  className="sh__cta sh__cta--primary magnetic-btn"
                  style={{ marginTop: '1.5rem', fontSize: '0.85rem', padding: '0.75rem 1.5rem' }}
                  onClick={() => setStatus('idle')}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="sc__form" id="social-contact-form" onSubmit={handleSubmit} aria-label="Contact form">
                <div className="sc__row">
                  <div className="sc__field">
                    <label className="sc__label" htmlFor="scf-name">Name</label>
                    <input
                      id="scf-name"
                      className="sc__input"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="sc__field">
                    <label className="sc__label" htmlFor="scf-email">Email</label>
                    <input
                      id="scf-email"
                      className="sc__input"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="sc__field">
                  <label className="sc__label" htmlFor="scf-project">Tell us about your brand</label>
                  <textarea
                    id="scf-project"
                    className="sc__textarea"
                    rows={5}
                    placeholder="What are you looking to achieve?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    minLength={10}
                    required
                  />
                </div>
                <div className="sc__submit-row">
                  {status === 'error' && (
                    <p className="wc__error-msg">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    className="sh__cta sh__cta--primary magnetic-btn"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <><Loader2 size={16} className="sc__spin" /> Sending...</>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            )}
            <div className="sc__direct-icons-only">
              {socialLinks.map((s) => {
                let Icon = FaCommentDots;
                if (s.icon.toLowerCase().includes('whatsapp') || s.name.toLowerCase().includes('whatsapp')) Icon = FaWhatsapp;
                else if (s.icon.toLowerCase().includes('mail') || s.icon.toLowerCase().includes('gmail')) Icon = FaEnvelope;
                else if (s.icon.toLowerCase().includes('phone') || s.icon.toLowerCase().includes('call')) Icon = FaPhoneAlt;
                else if (s.icon.toLowerCase().includes('insta')) Icon = FaInstagram;
                return (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="sc__direct-icon-only" title={s.name}>
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
