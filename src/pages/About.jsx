const values = [
    { title: 'Reliability', body: 'We show up on time, every time. Your schedule matters.' },
    { title: 'Thoroughness', body: 'No corner is skipped. We clean the way you would if you had the time.' },
    { title: 'Trust', body: 'All staff are vetted, trained, and insured. Your home is safe with us.' },
]

const team = [
    { name: 'Kerri Osei', role: 'Founder & Head Cleaner', initial: 'KO' },
    { name: 'Temi Adeyemi', role: 'Operations Manager', initial: 'TA' },
    { name: 'Bola Hassan', role: 'Senior Cleaner', initial: 'BH' },
]

export default function About() {
    return (
        <>
            <section className="section section--white">
                <div className="container">
                    <div className="about-grid">
                        <div>
                            <h1>Built on trust and clean results.</h1>
                            <p style={{ color: 'var(--text-soft)', marginTop: '1rem', marginBottom: '1.6rem' }}>
                                Kerri Cleaner was founded with one goal: to give people more time
                                for what matters by taking cleaning completely off their plate.
                                Every clean is done with care, not just speed.
                            </p>
                            <div className="values-list">
                                {values.map((v) => (
                                    <div className="value-item" key={v.title}>
                                        <div className="value-item__dot" />
                                        <div>
                                            <h4>{v.title}</h4>
                                            <p>{v.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="about-img-placeholder">Your photo here</div>
                    </div>
                </div>
            </section>

            <section className="section container">
                <h2>Meet the team</h2>
                <p style={{ color: 'var(--text-soft)', marginTop: '0.4rem' }}>
                    Real people who take pride in the work.
                </p>
                <div className="team-grid">
                    {team.map((member) => (
                        <div className="team-card" key={member.name}>
                            <div className="team-card__photo">{member.initial}</div>
                            <div className="team-card__body">
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}