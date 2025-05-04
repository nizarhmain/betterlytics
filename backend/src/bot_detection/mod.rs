use lazy_static::lazy_static;
use woothee::parser::{Parser, WootheeResult};

lazy_static! {
    static ref PARSER: Parser = Parser::new();
}

/// Checks if the given user agent string belongs to a known bot/crawler.
pub fn is_bot(user_agent: &str) -> bool {
    // Early return for empty user agent strings - we may want to not count these as bots
    if user_agent.is_empty() {
        return true;
    }

    let mut tmp_result = WootheeResult::new();
    PARSER.try_crawler(user_agent, &mut tmp_result)
}